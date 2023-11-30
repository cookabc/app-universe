#!/bin/bash

# List of folders to iterate through
folders=("cuckoo" "face" "pacman" "pose" "snake" "tic-tac-toe")

# Function to execute npm run build in a folder
build_folder() {
    local folder="apps/$1"

    # Move into the folder
    cd "$folder" || exit

    # Execute npm run build
    npm run deploy

    # Move back to the original directory
    cd ".." || exit
}

# Iterate through each folder concurrently
for folder in "${folders[@]}"; do
    build_folder "$folder" &
done

# Wait for all background jobs to finish
wait
