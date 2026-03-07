import asyncio
import random
import logging
from abc import ABC, abstractmethod
from typing import Dict, Type, List, Any, Callable
from functools import wraps

# Setup Logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("System")

# --- 1. Advanced Decorator: Async Retry with Exponential Backoff ---
def async_retry(max_retries: int = 3, delay: float = 1.0, backoff: float = 2.0):
    """
    Decorator to retry an async function upon failure with exponential backoff.
    """
    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            current_delay = delay
            for attempt in range(max_retries):
                try:
                    return await func(*args, **kwargs)
                except Exception as e:
                    logger.warning(f"Attempt {attempt + 1} failed for {func.__name__}: {e}")
                    if attempt == max_retries - 1:
                        logger.error(f"Max retries reached for {func.__name__}")
                        raise
                    await asyncio.sleep(current_delay)
                    current_delay *= backoff
        return wrapper
    return decorator

# --- 2. Metaclass: Automatic Plugin Registry ---
class ProcessorRegistry(type):
    """
    Metaclass that automatically adds any subclass to a central registry.
    This allows plugins to be added just by defining the class.
    """
    registry: Dict[str, Type['BaseProcessor']] = {}

    def __new__(cls, name, bases, attrs):
        new_class = super().__new__(cls, name, bases, attrs)
        # Avoid registering the Base abstract class itself
        if name != "BaseProcessor":
            if 'processor_name' not in attrs:
                raise TypeError(f"Class {name} missing required 'processor_name' attribute")
            cls.registry[attrs['processor_name']] = new_class
            logger.info(f"Registered processor: {attrs['processor_name']}")
        return new_class

# --- 3. Base Abstract Class ---
class BaseProcessor(ABC, metaclass=ProcessorRegistry):
    processor_name: str

    def __init__(self, config: Dict[str, Any]):
        self.config = config

    @abstractmethod
    async def process(self, data: Any) -> Any:
        """Core processing logic to be implemented by subclasses."""
        pass

# --- 4. Concrete Implementations (The Plugins) ---

class DataMiner(BaseProcessor):
    processor_name = "miner"

    @async_retry(max_retries=3)
    async def process(self, data_id: int) -> Dict[str, Any]:
        # Simulate Network IO latency and occasional failure
        await asyncio.sleep(random.uniform(0.1, 0.5)) 
        
        if random.random() < 0.2: # 20% chance of failure to test retry
            raise ConnectionError("Simulated network failure")
            
        return {"id": data_id, "mined_value": random.randint(1, 100)}

class DataEnricher(BaseProcessor):
    processor_name = "enricher"

    async def process(self, data: Dict[str, Any]) -> Dict[str, Any]:
        # Simulate CPU bound work
        await asyncio.sleep(0.1)
        data["enriched"] = True
        data["checksum"] = hex(id(data))
        return data

# --- 5. The Orchestrator (Async Generator & Pipeline) ---

class PipelineEngine:
    def __init__(self):
        self.miner = ProcessorRegistry.registry['miner']({})
        self.enricher = ProcessorRegistry.registry['enricher']({})

    async def data_stream(self, count: int):
        """Async Generator yielding raw data IDs."""
        for i in range(count):
            yield i

    async def run_pipeline(self, batch_size: int = 10):
        logger.info("Starting Pipeline...")
        
        # Create a stream of tasks
        tasks = []
        async for item_id in self.data_stream(batch_size):
            task = asyncio.create_task(self._handle_item(item_id))
            tasks.append(task)
        
        # Gather results concurrently
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Process results
        valid_results = [r for r in results if not isinstance(r, Exception)]
        errors = [r for r in results if isinstance(r, Exception)]
        
        logger.info(f"Pipeline Complete. Success: {len(valid_results)}, Errors: {len(errors)}")
        return valid_results

    async def _handle_item(self, item_id: int):
        """Chains the miner and enricher."""
        raw_data = await self.miner.process(item_id)
        final_data = await self.enricher.process(raw_data)
        return final_data

# --- 6. Execution Entry Point ---
if __name__ == "__main__":
    engine = PipelineEngine()
    
    # Run the async event loop
    try:
        results = asyncio.run(engine.run_pipeline(batch_size=10))
        for res in results[:3]: # Print first 3 for brevity
            print(f"Result: {res}")
    except KeyboardInterrupt:
        print("Stopped by user.")