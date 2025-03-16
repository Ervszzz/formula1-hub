# Formula 1 Hub

A React-based web application that displays Formula 1 data including driver standings, race schedule, and last race results with a modern, tech-inspired UI.

## Features

- Current driver standings with points and wins
- Complete race schedule for the current season
- Detailed results from the last race with race winner and podium finishers
- Scrollable tables for driver standings and race results
- Responsive design for all devices
- Team color-coded information for easy identification

## Technologies Used

- React.js
- Tailwind CSS
- Vite
- Ergast F1 API (via Jolpica API proxy)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/formula1-hub.git
cd formula1-hub
```

2. Install dependencies

```bash
npm install
```

3. Start the development server

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Development

### Branch Information

Always push changes to the `main` branch, not `master`.

```bash
git checkout main
git add .
git commit -m "Your commit message"
git push origin main
```

## API

This project uses the Ergast F1 API (via Jolpica API proxy) to fetch Formula 1 data. The API provides comprehensive Formula 1 data including:

- Driver standings
- Constructor standings
- Race results
- Race schedules
- Qualifying results
- Lap times

## UI Features

- Tech-inspired design with glowing elements and futuristic styling
- Collapsible sections to focus on important information
- Color-coded team information for easy identification
- Responsive layout that works on mobile, tablet, and desktop devices

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Ergast F1 API](http://ergast.com/mrd/) for providing the Formula 1 data
- [Jolpica API](https://jolpica.com/) for the API proxy service
- [Tailwind CSS](https://tailwindcss.com/) for the styling
- [React](https://reactjs.org/) for the UI library
- [Vite](https://vitejs.dev/) for the build tool
