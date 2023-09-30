import React, { useEffect, useState } from 'react'
import forecastImage from '../Images/forecast.png';
import weatherIcon from '../Images/search.png';
import Clock from 'react-live-clock';
import moment from 'moment/moment';
import Api from '../Config/config';

export default function Forcast() {

    var [forecast, setForecast] = useState({});
    var [city, setCity] = useState("");
    var [err, setErr] = useState(false);

    useEffect(()=>{
        async function getData(){
            if(city !== ""){
              setErr(false);
              var response = await fetch(`${Api.apiName}q=${city}&units=metric&appid=${Api.apiKey}`)
              var data = await response.json();
              console.log(data);
              setForecast(data);
            }
            else{

              if(navigator.geolocation){
                navigator.geolocation.getCurrentPosition(
                  async (pos)=>{
                    setErr(false);
                    var res2 = await fetch(`${Api.apiName}lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&units=metric&id=524901&appid=${Api.apiKey}`);
                    var data2 = await res2.json();
                    setForecast(data2);
                  },
                  (e)=>{
                    alert("Location services denied!");
                    setErr(true);
                  }
                )
              }
              else{
                alert("location services not found!");
                setErr(true);
              }

              
            }
            
        }
        getData();
    }, [city])

    function search(){
      var cityName = document.getElementById("cityName").value;
      if(cityName.trim() !== ""){
        setCity(cityName);
        document.getElementById("cityName").value = "";
      }
      else{
        alert("Please enter a valid city name!");
      }
    }

    function keySearch(e){
      if(e.keyCode === 13){
        search();
      }
    }

  return (
    <div>
       <div className='main-parent'>
      {/* main parent container */}
      <div className="container">

        {/* first child */}
        <div className="city">

          {/* first grandchild */}
          {!err?
          <>
            <div className="title">{forecast.name} <br/> {forecast.sys?.country}</div>
          </>: 
          <>
            <div className="title">City Not Found :(</div>
          </>}

          {/* second grandchild */}
          <div className="date-time">

            {/* first greatgrandchild */}
            <div className="dmy">
              <div className="current-time"> <span><Clock format={'HH:mm:ss'} ticking={true} timezone={'US/Pacific'} /></span></div>
              {!err?
              <>
                <div className="current-date"> <span>{moment(forecast.dt*1000).format("ll")}</span></div>
              </>: null}
              
            </div>

            {/* second greatgrandchild */}
            <div className="temperature">
              {!err?
              <>
                <p>{Math.round(forecast.main?.temp)} &deg;C</p>
              </>: null}
            </div>

          </div>
        </div>

        {/* second child */}
        <div className="forecast">

        
          {/* first granchild */}
          <div className="forecast-icon">
            <img src={forecastImage} alt="forecastIcon" width={100} />
          </div>

          {/* second grandchild */}
          <div className="today-weather">
            {!err?
            <>
              <h3>{forecast.weather?.[0].main}</h3>
            </>: null}
            
            <div className="search">
              <input type="search" className='search-bar' id="cityName" placeholder='Search Any City' onKeyDown={keySearch}/>
              <img src={weatherIcon} alt="weatherIcon" onClick={search}/>
            </div>
          </div>

          {/* third grandchild */}
          {!err?
          <>
            <ul>
              <div>
                <li className='cityHead'>
                  <p>{forecast.weather?.[0].description}</p>
                  <img src={`https://openweathermap.org/img/wn/${forecast.weather?.[0].icon}@2x.png`} alt="cityHeadImage" />
                </li>
                <hr />
                <div className="info">
                  <li className='temp'>Temperature <span>{Math.round(forecast.main?.temp)} &deg;C</span></li>
                  <hr />
                  <li className='humi'>Humidity <span>{forecast.main?.humidity} %</span></li>
                  <hr />
                  <li className='visi'>Visibilty <span>{Math.round(forecast.visibility*0.00062137)} mi</span></li>
                  <hr />
                  <li className='wind'>Wind Speed <span>{forecast.wind?.speed} Km/h</span></li>
                  <hr />
                </div>
              </div>
            </ul>
          </>: null}
          
        </div>

      </div>

      </div>
    </div>
  )
}
