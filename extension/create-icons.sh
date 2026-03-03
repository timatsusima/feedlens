#!/bin/bash
# Create placeholder icons using ImageMagick or base64 encoded PNGs
# For now, create simple colored squares as placeholders

# Create a simple base64 encoded 16x16 red icon
echo "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAdgAAAHYBTnsmCAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAABZSURBVDiNY2AYBaNgFFA" | base64 -d 2>/dev/null || echo ""
