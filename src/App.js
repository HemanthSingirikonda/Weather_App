import { useState } from 'react';
import './App.css';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';

function App() {
  const [data,setData]=useState({});
  const [location,setLocation]=useState('');
  const [isFetched,setIsFetched]=useState(false);

  const url=`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${process.env.REACT_APP_API_KEY}`;
  // fetch(url).then(res=>res.json()).then(data=>console.log(data));

  const fetchWeatherData=async(event)=>{
    if(event.key==='Enter'){
      try {
        await axios.get(url).then(response=>{
          setData(response.data);
          // console.log(response.data);
          setLocation('');
          setIsFetched(true);
        })
        
      } catch (error) {
        // console.log(error.response.status);
        setLocation('');
        setIsFetched(false);
        if(error.response.status===429){
          toast.error("You are being rate limited") //error of rate limit of api requests
        }
        else{
          toast.error("Please check the city name and try again. If not, the requested city's data is not available") //error of wrong spellings or not available cities
        } 
        
      }
      
    }
    // console.log(event.key);
  }

  return (
    <div className="App">
      <div><Toaster/></div>
      <div className='search'>
        <input
          value={location}
          onChange={e=>setLocation(e.target.value)}
          onKeyDown={fetchWeatherData}
          placeholder='Enter a location'
          type='text'
        />
      </div>
      {isFetched && <div className='container'>
        <div className='top'>
            <div className='location'>
              <p>{data.name}</p>
            </div>
            <div className='cover'>
            <div className='temperature'>
              {data.main && <h1>{data.main.temp.toFixed()}°C</h1>}
            </div>
            <div className='description'>
              {data.weather && <p>{data.weather[0].main}</p>}
            </div>
            </div>
        </div>
        <div className='bottom'>
            <div className='feels'>
              {data.main && <p className='bold text'>{data.main.feels_like.toFixed()}°C</p>}
              <p>Feels Like</p>
            </div>
            <div className='humidity'>
              {data.main && <p className='bold text'>{data.main.humidity}%</p>}
              <p>Humidity</p>
            </div>
            <div className='wind'>
              {data.wind && <p className='bold text'>{data.wind.speed} KMPH</p>}
              <p>Wind Speed</p>
            </div>
        </div>
      </div>}
    </div>
  );
}

export default App;
