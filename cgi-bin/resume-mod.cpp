#include <iostream>
#include <cstdio>

int main() {
    const char* filename = "stop.txt";

    // Attempt to delete the file
    if (std::remove(filename) != 0) {
        perror("Error deleting file");
        return 1;
    } else {
        std::cout << "File successfully deleted" << std::endl;
    }

    return 0;
}
