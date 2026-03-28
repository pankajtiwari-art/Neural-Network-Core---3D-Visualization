# 🧠 Neural Network Core - 3D Visualization

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen.svg?style=for-the-badge)](https://pankajtiwari-art.github.io/Neural-Network-Core---3D-Visualization/)
[![Three.js](https://img.shields.io/badge/three.js-black?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg?style=for-the-badge)](https://www.gnu.org/licenses/gpl-3.0)

> A high-performance, interactive 3D visualization system built with Three.js featuring dynamic signal propagation, customizable geometries, and real-time post-processing effects.

---

## 📋 Features

### 🧊 Geometry Options
* **Cube** - Classic cubic structure
* **Sphere** - Perfect spherical volume
* **Pyramid** - Triangular pyramid form
* **Hexagon** - Hexagonal prism
* **Torus** - Donut/torus shape

### 🎇 Visual Effects
* ✨ **Bloom Effect** - Post-processing glow (can be toggled)
* 🌫️ **Fog System** - Atmospheric depth perception
* 🎨 **Customizable Colors** - Background, wire, and signal colors
* 💫 **Signal Animation** - Flowing particles along network paths

### 🖱️ Interaction
* 🕹️ **Orbit Controls** - Free camera movement and rotation
* 🔄 **Auto-Rotation** - Optional automatic spinning
* 🎛️ **Real-time GUI** - Adjust all parameters live with `lil-gui`
* 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices

### ⚡ Performance Optimizations
* Efficient geometry generation
* GPU-accelerated rendering
* High-performance shader materials
* Adaptive pixel ratio scaling
* Optimized memory management

---

## 🚀 Quick Start

### Installation
No build process needed! Just serve the files with a local web server.

### For Local Development

Choose your preferred method to start a local server:

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
```text
.
├── index.html      # Main HTML file with import map
├── style.css       # All styling and GUI customization
└── script.js       # Complete Three.js implementation
```

---

## 🎮 Controls

### Mouse / Trackpad
* **Left Click + Drag** - Rotate camera
* **Right Click + Drag** - Pan camera
* **Scroll** - Zoom in/out

### Keyboard
* **Tab** - Toggle GUI visibility

---

## 🎛️ GUI Controls
*Located at the bottom-right of the screen:*

| Category | Controls |
| :--- | :--- |
| **Geometry** | Form Factor (Select shape type), Only External (Show only surface or entire volume) |
| **Colors** | Background, Wire Color, Signal Color |
| **Signal Properties** | Flow Speed (0.05-2.0), Signal Tail (0.01-0.5), Density (1.0-10.0) |
| **Rendering** | Fog Enabled, Fog Density, Bloom Effect, Bloom Threshold, Bloom Strength, Bloom Radius |
| **Interaction** | Auto Rotate, Rotation Speed (0.1-3.0) |

---

## 🔧 Configuration

All parameters can be modified directly in the GUI, but you can also preset values in `script.js`:

```javascript
const params = {
    shape: 'Cube',               // Default shape
    backgroundColor: '#141414',  // Dark background
    lineColor: '#5c5c5c',        // Gray wire
    dotColor: '#33ccff',         // Cyan signal
    speed: 0.1311,               // Animation speed
    // ... more parameters
};
```

---

## 📊 Performance Tips

1. **Reduce Segments** - If FPS is low, the geometry uses fewer segments automatically.
2. **Disable Bloom** - Turning off bloom improves performance on slower devices.
3. **Lower Fog Density** - Reduces depth computation.
4. **Disable Auto-Rotate** - Reduces unnecessary rendering updates.

---

## 🐛 Troubleshooting

### Blank Screen
* Check browser console for errors (`F12`).
* Ensure you're serving files over HTTP/HTTPS (not `file://`).
* Clear browser cache and reload.
* Check that all three files (HTML, CSS, JS) are in the same directory.

### Low Performance
* Reduce browser window size.
* Disable bloom effect via GUI.
* Switch to a simpler shape (like Cube).

### Import Errors
* Ensure your browser supports ES modules.
* Check the network tab for failed imports.
* Verify CDN URLs are accessible.

---

## 🌐 Browser Support

| Browser | Version | Support |
| :--- | :--- | :---: |
| Chrome/Edge | 67+ | ✅ |
| Firefox | 67+ | ✅ |
| Safari | 11+ | ✅ |
| Opera | 54+ | ✅ |

---

## 📦 Dependencies

All dependencies are loaded efficiently via CDN:
* **[Three.js (v0.160.0)](https://threejs.org/)** - 3D graphics library
* **[lil-gui](https://lil-gui.georgealways.com/)** - GUI control panel
* **OrbitControls** - Camera controls
* **EffectComposer** - Post-processing pipeline

---

## 💡 Tips & Tricks

* **Create Presets:** Modify the `params` object in JS for custom default states.
* **Custom Colors:** Use hex, rgb, or named CSS colors in the code.
* **Performance Monitoring:** Use your browser's DevTools performance tab to profile.
* **Responsive Behavior:** The GUI and canvas automatically scale on mobile devices.

---

## 🤝 Contributing

Suggestions and improvements are welcome! Consider contributing by:
* Adding new geometric shapes
* Creating custom animation patterns
* Adding more post-processing effects
* Enhancing mobile-optimized controls

---

## 📄 License & Support

* **License:** This project is licensed under the [GNU General Public License v3.0](https://www.gnu.org/licenses/gpl-3.0).
* **Support:** If you encounter issues, check the browser console, verify file paths, or ensure JavaScript is enabled.

---
*Enjoy exploring the Neural Network Core! 🚀*
