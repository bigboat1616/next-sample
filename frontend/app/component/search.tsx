import React, { useState } from 'react';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import getNearFood from './getNearFood';
const containerStyle = {
  width: '1200px',
  height: '800px'
};
type MarkerPoint = {
    lat: number,
    lng: number,
  };
const center : MarkerPoint = {
    lat: 35.7022589,
    lng: 139.7744733,
};
function GeocodeComponent() {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY!
    });
    const [address, setAddress] = useState('');
    const [location, setLocation] = useState<MarkerPoint | null>(null);
    const handleInput = (e : React.ChangeEvent<HTMLInputElement>) => {
      setAddress(e.target.value);
    };
    const handleSearch = async () => {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ address: address }, (results, status) => {
            if (status === 'OK' && results && results.length > 0) {
                setLocation({
                    lat: results[0].geometry.location.lat(), // 関数を呼び出して数値を取得
                    lng: results[0].geometry.location.lng()  // 同上
                })
                ;
            } else {
              alert('Geocode was not successful for the following reason: ' + status);
            }
          });
    };
    const handleShop = async () => {
      const response = await fetch(`http://localhost:5000/coordinates/${address}`);
      const data = await response.json();
      console.log("Coordinates data:", data); // データのログを出力
      if ("error" in data) {
          alert('Location not found');
      } else {
          const { lat, lng } = data;
          const congestionResponse = await fetch(`http://localhost:5000/congestion/${address}`);
          const congestionData = await congestionResponse.json();
          console.log("Congestion data:", congestionData); // 混雑度データのログを出力
          if ("error" in congestionData) {
              alert('Congestion data not available');
          } else {
              // ポップアップを表示する InfoWindowF コンポーネントを動的に生成
              const infoWindowContent = (
                  <>
                      <p>Congestion: {congestionData.congestion}%</p>
                  </>
              );
              const infoWindowPosition = { lat, lng };
              setInfoWindow({
                  position: infoWindowPosition,
                  content: infoWindowContent
              });
          }
      }
    };
    
  
  // ポップアップ表示用の InfoWindowF コンポーネントを追加
  const [infoWindow, setInfoWindow] = useState<{ position: { lat: number; lng: number }; content: JSX.Element } | null>(null);
    return (
        <div>
            {isLoaded ? (
              <>
                <input type="text" value={address} onChange={handleInput}
                        style={{
                            width: '400px', // 検索ボックスの幅を調整
                            height: '40px', // 高さを設定
                            fontSize: '20px', // フォントサイズを大きくする
                            padding: '5px', // パディングを追加
                            margin: '10px 0', // 上下のマージンを設定
                            border: '1px solid #ccc', // 境界線のスタイルを設定
                            borderRadius: '5px', // 境界線の角を丸くする
                }}
                />
                <button
                onClick={handleSearch}>
                    Search
                </button>
                <button
                onClick={handleShop}>
                    congestion
                </button>
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={location || center}
                  zoom={16}
                >
                  {location && <Marker position={location} />}
                  {/* 上は検索した一点のみ表示，下は検索した周辺の飲食店を一括表示 */}
                  {/* {markers.map((marker, index) => (
                            <Marker key={index} position={marker} />
                        ))} */}
                </GoogleMap>
              </>
            ) : (
              <div>Loading...</div>
            )}
        </div>
    );
}
export default GeocodeComponent;

// 'use client'
// import React from 'react'
// import { GoogleMap, InfoWindowF, useJsApiLoader } from '@react-google-maps/api'
// import { InterfaceMapStyle } from '@/lib/MapStyles'

// const containerStyle = {
//     width: '1200px',
//     height: '800px'
// }

// const center = {
//     lat: 36,
//     lng: 140
// }

// const Map = React.memo(() => {
//     const { isLoaded } = useJsApiLoader({
//         id: 'google-map-script',
//         googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY!
//     })

//     const [map, setMap] = React.useState(null)

//     const onLoad = React.useCallback(function callback(map: any) {
//         // This is just an example of getting and using the map instance!!! don't just blindly copy!
//         const bounds = new window.google.maps.LatLngBounds(center)
//         map.fitBounds(bounds)

//         setMap(map)
//     }, [])

//     const onUnmount = React.useCallback(function callback(map: any) {
//         setMap(null)
//     }, [])

//     const mapOptions = {
//         styles: InterfaceMapStyle
//     }

//     return isLoaded ? (
//         <GoogleMap
//             mapContainerStyle={containerStyle}
//             options={mapOptions}
//             center={center}
//             zoom={10}
//             onLoad={onLoad}
//             onUnmount={onUnmount}
//         >
//             <InfoWindowF position={center}>
//                 <>
//                     <p>川本･計良研究室</p>
//                     <img
//                         width="100px"
//                         src="https://www.kawa-lab.org/wordpress/wp-content/uploads/2016/08/logo.png"
//                         alt=""
//                     />
//                 </>
//             </InfoWindowF>
//             <InfoWindowF position={{ lat: 35.62630103837421, lng: 140.1159142044246 }}>
//                 <>
//                     <p>龍之介</p>
//                     <p>5分待ち</p>
//                 </>
//             </InfoWindowF>
//             <InfoWindowF position={{ lat: 35.62406779026565, lng: 140.10121058980235 }}>
//                 <>
//                     <p>はん歩</p>
//                     <p>5分待ち</p>
//                 </>
//             </InfoWindowF>
//             <InfoWindowF position={{ lat: 35.62377319704928, lng: 140.10337833307406 }}>
//                 <>
//                     <p>北京亭</p>
//                     <p>15分待ち</p>
//                 </>
//             </InfoWindowF>
//             <InfoWindowF position={{ lat: 35.62215870364333, lng: 140.10323825145724 }}>
//                 <>
//                     <p>SAWASUKE</p>
//                     <p>30分待ち</p>
//                 </>
//             </InfoWindowF>
//             <InfoWindowF position={{ lat: 35.62304983241853, lng: 140.1073376318148 }}>
//                 <>
//                     <p>幸せのれんげ</p>
//                     <p>0分待ち</p>
//                 </>
//             </InfoWindowF>

//         </GoogleMap>
//     ) : (
//         <></>
//     )
// })

// const Page = () => {
//     return (
//         <div>
//             <h1>Google Map from Next App</h1>
//             <Map />
//         </div>
//     )
// }

// export default Page
