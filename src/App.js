import React, { useEffect, useState } from 'react';

const disableButton = (element) => {
  element.disabled = true;
  element.classList.add('disabled');
};

const enableButton = (element) => {
  element.disabled = false;
  element.classList.remove('disabled');
};

const App = () => {
  const [relayList, setRelayList] = useState([]);

  useEffect(() => {
    fetchRelayList();
  }, []);

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
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <img
              src="/logo_new.png"
              alt="OctoAqua"
              style={{ maxWidth: '300px', marginBottom: '20px' }}
          />
          <h1>Kamera Yönetim Paneli</h1>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
          {relayList.map((relay, index) => (
              <div
                  key={index}
                  style={{
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    padding: '20px',
                    width: '300px',
                    textAlign: 'center',
                    backgroundColor: '#f9f9f9',
                  }}
              >
                <h2>{relay.name}</h2>
                <p>IP: {relay.ipAddress}</p>
                <p>Durum: {relay.status ? 'Açık' : 'Kapalı'}</p>
                <p>Voltaj: {relay.voltage}</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                  <button
                      onClick={(e) => toggleRelay(e.currentTarget, relay.xname, true)}
                      style={{ padding: '10px', backgroundColor: '#041d3a', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                  >
                    Aç
                  </button>
                  <button
                      onClick={(e) => toggleRelay(e.currentTarget, relay.xname, false)}
                      style={{ padding: '10px', backgroundColor: '#ef5f2c', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                  >
                    Kapat
                  </button>
                </div>
              </div>
          ))}
        </div>
      </div>
  );
};

export default App;
