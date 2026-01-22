my_array = [64, 34, 25, 12, 22, 11, 90, 5]

n = len(my_array)
i = 0

while i < n - 1:
    j = 0
    while j < n - i - 1:
        if my_array[j] > my_array[j + 1]:
            my_array[j], my_array[j + 1] = my_array[j + 1], my_array[j]
        j += 1
    i += 1

print("Sorted array:", my_array)
