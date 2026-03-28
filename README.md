# 🧠 Neural Network Core - 3D Visualization

A high-performance, interactive 3D visualization system built with Three.js featuring dynamic signal propagation, customizable geometries, and real-time post-processing effects.

## 📋 Features

### Geometry Options
- **Cube** - Classic cubic structure
- **Sphere** - Perfect spherical volume
- **Pyramid** - Triangular pyramid form
- **Hexagon** - Hexagonal prism
- **Torus** - Donut/torus shape

### Visual Effects
- ✨ **Bloom Effect** - Post-processing glow (can be toggled)
- 🌫️ **Fog System** - Atmospheric depth perception
- 🎨 **Customizable Colors** - Background, wire, and signal colors
- 💫 **Signal Animation** - Flowing particles along network paths

### Interaction
- 🖱️ **Orbit Controls** - Free camera movement and rotation
- 🔄 **Auto-Rotation** - Optional automatic spinning
- 🎛️ **Real-time GUI** - Adjust all parameters live with lil-gui
- 📱 **Responsive Design** - Works on desktop and mobile devices

### Performance Optimizations
- Efficient geometry generation
- GPU-accelerated rendering
- High-performance shader materials
- Adaptive pixel ratio scaling
- Optimized memory management

## 🚀 Quick Start

### Installation
1. No build process needed! Just serve the files with a local web server.

### For Local Development
```bash
# Option 1: Using Python 3
python -m http.server 8000

# Option 2: Using Node.js (with http-server)
npx http-server

# Option 3: Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

### File Structure
```
.
├── index.html      # Main HTML file with import map
├── style.css       # All styling and GUI customization
└── script.js       # Complete Three.js implementation
```

## 🎮 Controls

### Mouse/Trackpad
- **Left Click + Drag** - Rotate camera
- **Right Click + Drag** - Pan camera
- **Scroll** - Zoom in/out

### Keyboard
- **Tab** - Toggle GUI visibility

### GUI Controls
Located at the bottom-right of the screen:

#### Geometry
- **Form Factor** - Select shape type
- **Only External** - Show only surface or entire volume

#### Colors
- **Background** - Scene background color
- **Wire Color** - Path line color
- **Signal Color** - Animated signal color

#### Signal Properties
- **Flow Speed** - Animation speed (0.05-2.0)
- **Signal Tail** - Length of signal burst (0.01-0.5)
- **Density** - Frequency of signal waves (1.0-10.0)

#### Rendering
- **Fog Enabled** - Toggle atmospheric fog
- **Fog Density** - Fog intensity (0.0-0.1)
- **Bloom Effect** - Toggle post-processing bloom
- **Bloom Threshold** - Color brightness for bloom (0.0-1.0)
- **Bloom Strength** - Bloom intensity (0.0-3.0)
- **Bloom Radius** - Bloom spread (0.0-1.0)

#### Interaction
- **Auto Rotate** - Enable/disable automatic rotation
- **Rotation Speed** - Rotation speed (0.1-3.0)

## 🔧 Configuration

All parameters can be modified directly in the GUI, but you can also preset values in `script.js`:

```javascript
const params = {
    shape: 'Cube',              // Default shape
    backgroundColor: '#141414',  // Dark background
    lineColor: '#5c5c5c',       // Gray wire
    dotColor: '#33ccff',        // Cyan signal
    speed: 0.1311,              // Animation speed
    // ... more parameters
};
```

## 📊 Performance Tips

1. **Reduce Segments** - If FPS is low, the geometry uses fewer segments automatically
2. **Disable Bloom** - Turning off bloom improves performance on slower devices
3. **Lower Fog Density** - Reduces depth computation
4. **Disable Auto-Rotate** - Reduces unnecessary rotations

## 🐛 Troubleshooting

### Blank Screen
1. Check browser console for errors (F12)
2. Ensure you're serving files over HTTP/HTTPS
3. Clear browser cache and reload
4. Check that all three files (HTML, CSS, JS) are in the same directory

### Low Performance
1. Reduce window size
2. Disable bloom effect
3. Switch to a simpler shape (Cube)
4. Disable auto-rotation

### Import Errors
1. Ensure browser supports ES modules
2. Check network tab for failed imports
3. Verify CDN URLs are accessible
4. Try a different CDN URL if issues persist

## 🌐 Browser Support

- Chrome/Edge 67+ ✅
- Firefox 67+ ✅
- Safari 11+ ✅
- Opera 54+ ✅

## 📦 Dependencies

All dependencies are loaded from CDN:
- **Three.js** v0.160.0 - 3D graphics library
- **lil-gui** - GUI control panel
- **OrbitControls** - Camera controls
- **EffectComposer** - Post-processing pipeline

## 💡 Tips & Tricks

1. **Create Presets** - Modify `params` object for custom presets
2. **Custom Colors** - Use hex, rgb, or named CSS colors
3. **Performance Monitoring** - Use browser DevTools performance tab
4. **Export Settings** - Save GUI settings manually from browser
5. **Responsive Behavior** - GUI automatically scales on mobile

## 📄 License

Free to use and modify for personal and commercial projects.

## 🤝 Contributing

Suggestions and improvements are welcome! Consider:
- Adding new geometric shapes
- Custom animation patterns
- Additional post-processing effects
- Mobile-optimized controls

## 📞 Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify file structure and paths
3. Try clearing browser cache
4. Check that JavaScript is enabled

---

**Enjoy exploring the Neural Network Core! 🚀**
