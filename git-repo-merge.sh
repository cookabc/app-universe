#!/bin/bash

# Set error handling
set -e

# Ensure both source and destination repository paths are provided
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <source-repo> <destination-repo>"
    echo "Example for local repo: $0 /path/to/source-repo /path/to/destination-repo"
    echo "Example for remote repo: $0 https://github.com/user/source-repo.git /path/to/destination-repo"
    exit 1
fi

SOURCE_REPO=$1
DEST_REPO=$2

# Check if the destination repository is a valid Git repository
if [ ! -d "$DEST_REPO/.git" ]; then
    echo "Error: $DEST_REPO is not a valid Git repository."
    exit 1
fi

# Determine the source repository name
if [[ $SOURCE_REPO == http* ]]; then
    # For remote repositories, extract the repo name from the URL
    SUBDIR_NAME=$(basename -s .git "$SOURCE_REPO")
else
    # For local repositories, check validity and extract the folder name
    if [ ! -d "$SOURCE_REPO/.git" ]; then
        echo "Error: $SOURCE_REPO is not a valid Git repository."
        exit 1
    fi
    SUBDIR_NAME=$(basename "$SOURCE_REPO")
fi

# Check if subdirectory already exists
if [ -d "$DEST_REPO/$SUBDIR_NAME" ]; then
    echo "Error: Subdirectory $SUBDIR_NAME already exists in destination repository."
    exit 1
fi

# Navigate to the destination repository
cd "$DEST_REPO" || exit 1

# Add the source repository as a remote
REMOTE_NAME="temp-source-repo"
echo "Adding source repository as remote..."
git remote add "$REMOTE_NAME" "$SOURCE_REPO" || {
    echo "Error: Failed to add remote repository"
    exit 1
}

# Fetch from remote and determine default branch
echo "Fetching source repository..."
git fetch "$REMOTE_NAME" || {
    echo "Error: Failed to fetch from source repository"
    git remote remove "$REMOTE_NAME"
    exit 1
}

# Determine default branch
DEFAULT_BRANCH=$(git remote show "$REMOTE_NAME" | grep "HEAD branch" | cut -d ":" -f 2 | xargs)
if [ -z "$DEFAULT_BRANCH" ]; then
    echo "Error: Could not determine default branch"
    git remote remove "$REMOTE_NAME"
    exit 1
fi

echo "Using default branch: $DEFAULT_BRANCH"

# Merge the source repository into the destination repository
echo "Merging repositories..."
if ! git merge -s ours --no-commit --allow-unrelated-histories "$REMOTE_NAME/$DEFAULT_BRANCH"; then
    echo "Error: Merge failed"
    git merge --abort || true
    git remote remove "$REMOTE_NAME"
    exit 1
fi

# Read the tree from the source repository into a subdirectory
echo "Reading source tree into subdirectory..."
if ! git read-tree --prefix="$SUBDIR_NAME/" -u "$REMOTE_NAME/$DEFAULT_BRANCH"; then
    echo "Error: Failed to read tree"
    git reset HEAD || true
    git remote remove "$REMOTE_NAME"
    exit 1
fi

# Commit the merge
echo "Committing changes..."
if ! git commit -m "Merged $SUBDIR_NAME into the repository as a subdirectory"; then
    echo "Error: Failed to commit merge"
    git reset HEAD~1 || true
    git remote remove "$REMOTE_NAME"
    exit 1
fi

# Remove the temporary remote
git remote remove "$REMOTE_NAME"

echo "Repositories have been successfully merged."
