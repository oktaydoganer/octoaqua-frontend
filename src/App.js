import React, { useEffect, useState } from 'react';
import Loading from "./Loading";
import "./App.css";

const App = () => {
  const [relayList, setRelayList] = useState([]);

  useEffect(() => {
    fetchRelayList();
  }, []);

  const disableButton = (element) => {
    setRelayList((prevItems) =>
        prevItems.map((item) =>
            item.id.toString() === element.getAttribute('data-id') ? { ...item, loading: true } : item
        )
    );
    console.log('disabled');
  };

  const enableButton = (element) => {
    setRelayList((prevItems) =>
        prevItems.map((item) =>
            item.id.toString() === element.getAttribute('data-id') ? { ...item, loading: false } : item
        )
    );
    console.log('enabled');
  };

  const fetchRelayList = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/relayList`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setRelayList(data);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const toggleRelay = async (button, xName, status) => {
    disableButton(button);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/toggle/${xName}/${status}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setRelayList((prevItems) =>
          prevItems.map((item) =>
              item.xname === xName ? { ...item, status: data.status, voltage: data.voltage } : item
          )
      );
    } catch (error) {
      console.error('Toggle error:', error);
    } finally {
      enableButton(button);
    }
  };

  return (
      <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <img
              src="/logo_new.png"
              alt="OctoAqua"
              style={{ maxWidth: '400px', marginBottom: '6px' }}
          />
          <h1 style={{marginTop:4}}>Kamera Yönetim Paneli</h1>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
          {relayList.map((relay, index) => (
              <div
                  key={index}
                  className="card"
              >
                <h2>{relay.name}</h2>
                <p>IP: {relay.ipAddress}</p>
                <p>Durum: {relay.status ? 'Açık' : 'Kapalı'}</p>
                <p>Voltaj: {relay.voltage}</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                  {!relay.loading ? (
                  <>
                  <button
                      id={'turnon' + relay.id}
                      onClick={(e) => toggleRelay(e.currentTarget, relay.xname, true)}
                      disabled={relay.loading}
                      data-id={relay.id}
                      className="button"
                      style={{ padding: '10px', backgroundColor: '#ef5f2c', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                  >
                    Aç
                  </button>
                  <button
                      id={'turnoff' + relay.id}
                      onClick={(e) => toggleRelay(e.currentTarget, relay.xname, false)}
                      disabled={relay.loading}
                      data-id={relay.id}
                      className="button"
                      style={{ padding: '10px', backgroundColor: '#041d3a', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                  >
                    Kapat
                  </button>
                  </>
                  ):(
                    <Loading />
                  )}
                </div>
              </div>
          ))}
        </div>
      </div>
  );
};

export default App;
