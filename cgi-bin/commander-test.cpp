// commander.cpp
#include <iostream>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <cstring>
#include <thread>
#include <chrono>
#include <fstream>
#include <signal.h>

volatile sig_atomic_t flag = 0;

void my_handler(int s){
    flag = 1;
}

bool file_exists(const char *fileName)
{
    std::ifstream infile(fileName);
    return infile.good();
}

void delete_file(const char *fileName)
{
    if (remove(fileName) != 0)
        perror("Error deleting file");
    else
        std::cout << "File successfully deleted" << std::endl;
}

void update_state_file(int command) {
    std::ofstream state_file("state.txt", std::ios::trunc);
    if (state_file.is_open()) {
        state_file << command << std::endl;
        state_file.close();
    } else {
        std::cerr << "Unable to open state.txt" << std::endl;
    }
}


int main(int argc, char* argv[]) {
    if (argc != 2) {
        std::cerr << "Usage: " << argv[0] << " <0|1>\n";
        return 1;
    }

    int start = std::stoi(argv[1]);
    if (start == 0) {
        std::ofstream outfile ("stop.txt");
        outfile.close();
        std::cout << "Stop signal sent. Exiting...\n";
        return 0;
    } else if (start != 1) {
        std::cout << "Program not started. Exiting...\n";
        return 0;
    }


    // Create a TCP socket for sending commands
    int command_socket = socket(AF_INET, SOCK_STREAM, 0);
    if (command_socket == -1) {
        perror("Failed to create command socket");
        return 1;
    }

    // Set up the address for sending commands
    sockaddr_in server_addr;
    server_addr.sin_family = AF_INET;
    server_addr.sin_port = htons(61000); // Command port
    server_addr.sin_addr.s_addr = inet_addr("10.8.0.4"); // Local device IP address

    // Connect to the MARLIN device to send commands
    if (connect(command_socket, (sockaddr*)&server_addr, sizeof(server_addr)) == -1) {
        perror("Connection failed");
        close(command_socket);
        return 1;
    }
    std::cout << "Connected to the MARLIN device to send commands" << std::endl;

    int commandInt = 1;
    int errorInt = -1;

    struct sigaction sigIntHandler;
    sigIntHandler.sa_handler = my_handler;
    sigemptyset(&sigIntHandler.sa_mask);
    sigIntHandler.sa_flags = 0;
    sigaction(SIGINT, &sigIntHandler, NULL);


    // Create the state.txt file
    std::ofstream state_file("state.txt");
    if (state_file.is_open()) {
        state_file.close();
    } else {
        std::cerr << "Unable to create state.txt" << std::endl;
        return 1;
    }


while (true) {


    // Create a new socket for receiving the file from MARLIN device
    int receive_socket = socket(AF_INET, SOCK_STREAM, 0);
    if (receive_socket == -1) {
        perror("Failed to create receive socket");
        return 1;
    }

    // Set up the address for receiving files
    sockaddr_in receive_server_addr;
    receive_server_addr.sin_family = AF_INET;
    receive_server_addr.sin_port = htons(62000); // Receiving port
    receive_server_addr.sin_addr.s_addr = inet_addr("10.8.0.1"); // Local device IP address

    int optval = 1;
    if (setsockopt(receive_socket, SOL_SOCKET, SO_REUSEADDR, &optval, sizeof(optval)) < 0) {
        perror("Error setting socket options");
        return 1;
    }

    // Bind the socket to the server address
    if (bind(receive_socket, (struct sockaddr*)&receive_server_addr, sizeof(receive_server_addr)) < 0) {
        perror("Error binding socket to server address");
        return 1;
    }

    // Listen for incoming connections
    if (listen(receive_socket, 1) < 0) {
        perror("Error listening on socket");
        return 1;
    }

    // Accept a connection
    struct sockaddr_in client_address;
    socklen_t client_address_len = sizeof(client_address);
    int client_sock;
    // Keep listening for the MARLIN prototype to send a request
    std::cout << "Waiting for MARLIN prototype to come online..." << std::endl;
    client_sock = accept(receive_socket, (struct sockaddr*)&client_address, &client_address_len);
    if (client_sock >= 0) {
        std::cout << "Accepted connection from MARLIN prototype " << inet_ntoa(client_address.sin_addr) << std::endl;
    }

    errorInt = -1;

    // Send command to start rec
    commandInt = 1;
    update_state_file(commandInt); // Update state.txt with 1

    if (send(command_socket, &commandInt, sizeof(commandInt), 0) == -1) {
        perror("Failed to send command");
        close(command_socket);
        return 1;
    }
    std::cout << "Command: " << commandInt << " sent successfully" << std::endl;
    std::cout << "1" << std::endl;

    // Wait for 15 seconds
    std::this_thread::sleep_for(std::chrono::seconds(24)); //streamed file length

    // Send command to stop rec
    commandInt = 0;

    if (send(command_socket, &commandInt, sizeof(commandInt), 0) == -1) {
        perror("Failed to send command");
        close(command_socket);
        return 1;
    }
    std::cout << "Command: " << commandInt << " sent successfully" << std::endl;
    std::cout << "0" << std::endl;

    std::this_thread::sleep_for(std::chrono::seconds(2));

    // Send command to pause listener
    commandInt = -1;

    if (send(command_socket, &commandInt, sizeof(commandInt), 0) == -1) {
        perror("Failed to send command");
        close(command_socket);
        return 1;
    }
    std::cout << "Command to pause listener sent successfully" << std::endl;

    // Receive the filename from the server
    char filename_buffer[1024];
    ssize_t filename_length = recv(client_sock, filename_buffer, sizeof(filename_buffer), 0);
    if (filename_length < 0) {
        perror("Error receiving filename");
        close(receive_socket);
        return 1;
    }

    std::string filename = std::string(filename_buffer, filename_length);
    if (filename.empty() || filename == "./" || filename == "../") {
        continue; // Skip to the next iteration of the loop
    }

    // Open the .wav file in binary mode
    std::string path = "/media/marlin/Elements41/prototype_data/";
    std::ofstream file(path + filename, std::ios::binary);
    if (!file) {
        perror("Error opening file");
        close(receive_socket);
        return 1;
    }

    // Receive the .wav file in chunks of 1024 bytes
    char buffer[1024];
    ssize_t bytes_received;
    size_t total_bytes_received = 0;
    while ((bytes_received = recv(client_sock, buffer, sizeof(buffer), 0)) > 0) {
        file.write(buffer, bytes_received);
	total_bytes_received += bytes_received;
	// Print a simple progress bar
        double total_megabytes_received = total_bytes_received / (1024.0 * 1024.0);  // Convert bytes to megabytes
        std::cout << "\rReceived " << total_megabytes_received << " MB - " << std::flush;
    }
    std::cout << "Audio data written to " << filename << std::endl;

    update_state_file(commandInt); // Update state.txt with 0

    if (bytes_received < 0) {
        perror("Error receiving file");
        close(receive_socket);
        update_state_file(errorInt);
        return 1;
    }

    // Close the file
    file.close();
    close(receive_socket);
    
    if (file_exists("stop.txt")) {
    std::cout << "Stop signal received. Pausing executiong...\n" << std::endl;
    std::cout << "Run ./resume to resume execution...\n" << std::endl;
    while (file_exists("stop.txt")) {
           std::this_thread::sleep_for(std::chrono::seconds(1));
    }
    std::cout << "Resuming execution successful" << std::endl;
    continue;
    }
    
    // Send command to resume listener
    commandInt = -2;

    if (send(command_socket, &commandInt, sizeof(commandInt), 0) == -1) {
        perror("Failed to send command");
        close(command_socket);
        return 1;
    }
    std::cout << "Command to resume listener sent successfully" << std::endl;
    
}

    // Close the sockets
    close(command_socket);
    std::cout << "Connection closed" << std::endl;

    // Delete the stop.txt file
    delete_file("stop.txt");

    return 0;
}
