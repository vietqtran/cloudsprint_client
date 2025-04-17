#!/bin/bash

print_message() {
    local color=$1
    local message=$2
    case $color in
        "green") echo -e "\e[32m$message\e[0m" ;;
        "yellow") echo -e "\e[33m$message\e[0m" ;;
        "red") echo -e "\e[31m$message\e[0m" ;;
        *) echo "$message" ;;
    esac
}

if [ ! -d "$HOME/.nvm" ]; then
    print_message "yellow" "NVM not found. Installing NVM..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
    
    print_message "green" "NVM installed successfully!"
else
    print_message "green" "NVM is already installed."
    
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
fi

if ! nvm ls 20.17.0 > /dev/null 2>&1; then
    print_message "yellow" "Node 20.17.0 not found. Installing..."
    nvm install 20.17.0
    print_message "green" "Node 20.17.0 installed successfully!"
else
    print_message "green" "Node 20.17.0 is already installed."
fi

print_message "yellow" "Switching to Node 20.17.0..."
nvm use 20.17.0
print_message "green" "Now using Node $(node -v)"

if ! yarn --version 2>/dev/null | grep -q "1.22.22"; then
    print_message "yellow" "Yarn 1.22.22 not found. Installing..."
    npm install -g yarn@1.22.22
    print_message "green" "Yarn 1.22.22 installed successfully!"
else
    print_message "green" "Yarn 1.22.22 is already installed."
fi

print_message "yellow" "Running yarn build..."
yarn build
if [ $? -eq 0 ]; then
    print_message "green" "Build completed successfully!"
else
    print_message "red" "Build failed!"
    exit 1
fi

print_message "yellow" "Running yarn dev..."
yarn dev