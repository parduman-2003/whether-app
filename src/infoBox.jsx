import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

export default function InfoBox() {
  const info = {
    temp: 18.58,
    weather: 'Clear Sky',
    humidity: 66,
    pressure: 1014,
  };

  return (
    <div className="infoBox">
      <h2>Weather Info: {info.weather}</h2>
      <Card sx={{ maxWidth: 345, margin: '0 auto' }}>
        <CardContent>
          <Typography variant="h5" component="div">
            Temperature: {info.temp}°C
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Humidity: {info.humidity}%
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Pressure: {info.pressure} hPa
          </Typography>
        </CardContent>
        <CardActions>
          <Typography variant="body2" color="text.secondary">
            Example static data
          </Typography>
        </CardActions>
      </Card>
    </div>
  );
}
