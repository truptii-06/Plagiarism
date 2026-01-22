import java.util.Scanner;

public class TicTacToe {

    static char[] board = {
        ' ', ' ', ' ',
        ' ', ' ', ' ',
        ' ', ' ', ' '
    };

    static char currentPlayer = 'X';

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        boolean gameOver = false;

        while (!gameOver) {
            printBoard();
            System.out.print("Player " + currentPlayer + ", enter position (1-9): ");
            int pos = sc.nextInt() - 1;

            if (pos < 0 || pos > 8 || board[pos] != ' ') {
                System.out.println("Invalid move! Try again.");
                continue;
            }

            board[pos] = currentPlayer;

            if (checkWin()) {
                printBoard();
                System.out.println("Player " + currentPlayer + " wins!");
                gameOver = true;
            } else if (isDraw()) {
                printBoard();
                System.out.println("Game is a draw!");
                gameOver = true;
            } else {
                switchPlayer();
            }
        }
        sc.close();
    }

    static void printBoard() {
        System.out.println();
        System.out.println(board[0] + " | " + board[1] + " | " + board[2]);
        System.out.println("--+---+--");
        System.out.println(board[3] + " | " + board[4] + " | " + board[5]);
        System.out.println("--+---+--");
        System.out.println(board[6] + " | " + board[7] + " | " + board[8]);
        System.out.println();
    }

    static boolean checkWin() {
        int[][] winPatterns = {
            {0,1,2}, {3,4,5}, {6,7,8}, // rows
            {0,3,6}, {1,4,7}, {2,5,8}, // columns
            {0,4,8}, {2,4,6}           // diagonals
        };

        for (int[] pattern : winPatterns) {
            if (board[pattern[0]] == currentPlayer &&
                board[pattern[1]] == currentPlayer &&
                board[pattern[2]] == currentPlayer) {
                return true;
            }
        }
        return false;
    }

    static boolean isDraw() {
        for (char c : board) {
            if (c == ' ') return false;
        }
        return true;
    }

    static void switchPlayer() {
        currentPlayer = (currentPlayer == 'X') ? 'O' : 'X';
    }
}
