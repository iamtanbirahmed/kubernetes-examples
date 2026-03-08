#!/bin/bash
set -e

# Get release tag from first argument
RELEASE_TAG=$1

if [ -z "$RELEASE_TAG" ]; then
  echo "Error: Release tag must be provided as an argument."
  exit 1
fi

# Strip 'v' prefix if present for Helm chart versioning
VERSION=${RELEASE_TAG#v}
echo "Updating Helm charts to version: $VERSION"

for chart in charts/*/Chart.yaml; do
  if [ -f "$chart" ]; then
    # Update standard version and appVersion
    yq -i ".version = \"$VERSION\" | .appVersion = \"$VERSION\"" "$chart"
    
    # If the chart has dependencies, update their versions as well
    if yq e '.dependencies' "$chart" | grep -q 'name'; then
      yq -i 'with(.dependencies[]; .version = "'$VERSION'")' "$chart"
    fi
  fi
done
