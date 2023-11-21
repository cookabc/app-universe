#!/bin/bash

# List of folders to iterate through
folders=("cuckoo" "face" "nlp" "pacman" "pose" "snake")

# Iterate through each folder
for folder in "${folders[@]}"; do
    # Move into the folder
    cd "$folder" || exit

    # Execute npm run build
    npm run deploy

    # Move back to the original directory
    cd ".." || exit
done
