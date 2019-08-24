import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { createBrowserHistory } from 'history';
import { Offline, Online } from 'react-detect-offline';
import './App.css';

const TOKEN = 'U1S3jIj0e3AWun73hCingr6kGsSTqeZgZeOoj2qvvidp5obQAPKF5XIfF7g';
const options = {
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    Accept: 'application/json',
  }
};

let history;
let unlisten;

function App() {
  const [rooms, setRooms] = useState([]);
  const [currentView, setCurrentView] = useState(null);

  history = createBrowserHistory();

  unlisten = history.listen((location, action) => {
    if (action === 'POP') {
      setCurrentView(null);
    }
  });

  useEffect(() => {
    (async () => {
      const { data } = await axios.get('https://challenge.thef2e.com/api/thef2e2019/stage6/rooms', options);
      if (data.success) {
        setRooms(data.items);
      }
    })();

    return () => { unlisten(); };
  }, []);

  const [cName, setCName] = useState('');
  const [cTel, setCTel] = useState('');
  const [cDate, setCDate] = useState('');

  const viewRoom = async (roomId) => {
    const { data } = await axios.get(`https://challenge.thef2e.com/api/thef2e2019/stage6/room/${roomId}`, options);
    if (data.success) {
      setCurrentView(data);
      history.push(`/${roomId}`, { roomId, })
    }
  }

  const bookRoom = async (roomId) => {
    const { data } = await axios.post(`https://challenge.thef2e.com/api/thef2e2019/stage6/room/${roomId}`, {
      name: cName,
      tel: cTel,
      date: [cDate, moment(cDate).add(1, 'days').format('YYYY-MM-DD')],
    }, options);
    if (data.success) {
      viewRoom(roomId);
    }
  }

  const cancelAll = async () => {
    const { data } = await axios.delete('https://challenge.thef2e.com/api/thef2e2019/stage6/rooms', options);
    if (data.success) {
      setCurrentView(null);
    }
  }

  return (
    <div className="App">
      <div className="blog">
        <a href="https://noob.tw/react-pwa">Readme!</a>
      </div>
      <header onClick={ () => { setCurrentView(null) } }>
        <h1>訂房 × PWA Example</h1>
      </header>
      {currentView === null ?
        <ul className="roomList">
          {rooms.map(room => <li className="room" key={room.id} onClick={() => {viewRoom(room.id)}}>
            <div className="image" style={{
              backgroundImage: `url(${room.imageUrl})`,
            }}></div>
            <div className="name">{room.name}.</div>
            <div className="price">平日 {room.normalDayPrice}　假日 {room.holidayPrice}</div>
          </li>)}
        </ul> :
        <div>
          <div className="roomDetail">
            <div className="img">
              <img className="image" src={currentView.room[0].imageUrl} alt=""/>
            </div>
            <div className="detail">
              <div className="name">{currentView.room[0].name}</div>
              <div className="price">平日 {currentView.room[0].normalDayPrice}　假日 {currentView.room[0].holidayPrice}</div>
              <div className="desc">{currentView.room[0].description}</div>
            </div>
            <Online>
              {currentView.booking.length ?
                <div>
                  <h2>預約詳情</h2>
                  <div className="contactName">姓名：{currentView.booking[0].name}</div>
                  <div className="contactTel">電話：{currentView.booking[0].tel}</div>
                  <div className="contactDate">日期：{currentView.booking[0].date}</div>
                  <div className="submit">
                    <button onClick={() => { cancelAll() }}>取消所有預約</button>
                  </div>
                </div>
                :
                <div>
                  <h2>我要預約</h2>
                  <div className="contactName"> 姓名：
                    <input type="text" autoComplete="off" defaultValue={cName} onChange={(e) => { setCName(e.target.value) }}></input>
                  </div>
                  <div className="contactTel"> 電話：
                    <input type="tel" autoComplete="off" defaultValue={cTel} onChange={(e) => { setCTel(e.target.value) }}></input>
                  </div>
                  <div className="contactDate"> 日期：
                    <input type="date" autoComplete="off" defaultValue={cDate} onChange={(e) => { setCDate(e.target.value) }}></input>
                  </div>
                  <div className="submit">
                    <button disabled={!cName || !cTel || !cDate} onClick={ () => { bookRoom(currentView.room[0].id) } }>Do it!</button>
                  </div>
                </div>
              }
            </Online>
            <Offline>
              <div class="oops">離線時無法訂房或查看訂房狀態。</div>
            </Offline>
          </div>
        </div>
      }
      <footer>
        Copyleft 2019 NoobTW. Book × PWA Example.
      </footer>
    </div>
  );
}

export default App;
