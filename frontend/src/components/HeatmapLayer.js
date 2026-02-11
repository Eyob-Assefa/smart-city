import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';

const HeatmapLayer = ({ points }) => {
  const map = useMap();

  useEffect(() => {
    if (!points || points.length === 0) return;

    // formatting: [lat, lng, intensity]
    // We default intensity to 0.5 if not provided
    const heatPoints = points.map(p => [p.lat, p.lng, p.intensity || 0.5]);

    const heat = L.heatLayer(heatPoints, {
      radius: 25,
      blur: 15,
      maxZoom: 17,
      max: 1.0,
      gradient: {
        0.4: 'blue',
        0.6: 'cyan',
        0.7: 'lime',
        0.8: 'yellow',
        1.0: 'red'
      }
    });

    heat.addTo(map);

    // Cleanup when component unmounts
    return () => {
      map.removeLayer(heat);
    };
  }, [points, map]);

  return null;
};

export default HeatmapLayer;