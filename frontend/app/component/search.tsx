import React, { useState } from 'react';
import { GoogleMap, Marker, useJsApiLoader} from '@react-google-maps/api';
import "../globals.css";
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

let Map: google.maps.Map;
const googleMapsLibraries : Array<"places"> = ['places'];
let place_ids: string[] = [];
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
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY!,
        libraries : googleMapsLibraries,
    });
    const [address, setAddress] = useState('');
    const [location, setLocation] = useState<MarkerPoint | null>(null);
    const [markers, setMarkers] = useState<MarkerPoint>(center);
    const [coordinatesList, setCoordinatesList] = useState<{lat: number; lng: number }[]>([]);
    const mapRef = React.useRef<google.maps.Map | null>(null);
    const onLoad = React.useCallback((map: google.maps.Map) => {mapRef.current = map;}, []);
    const options = {
        disableDefaultUI: true,
        zoomControl: true,
      };
    const handleInput = (e : React.ChangeEvent<HTMLInputElement>) => {
      setAddress(e.target.value);
    };
    const handleSearch = async () => {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ address: address }, (results, status) => {
            if (status === 'OK' && results && results.length > 0) {
                const newLocation=({
                    lat: results[0].geometry.location.lat(), // 関数を呼び出して数値を取得
                    lng: results[0].geometry.location.lng()  // 同上
                });
                setLocation(newLocation);
                getNearFood(newLocation.lat, newLocation.lng);
            }
            });
    };
    // 近隣の飲食店を検索
    function getNearFood(lat: Number, lng: Number) {
        try {
          if (document.getElementById('map') == null || typeof document.getElementById('map') == null) {
            return;
          }
          var pyrmont = new google.maps.LatLng(
            parseFloat(lat.toString()),
            parseFloat(lng.toString()),
          );
          Map = new google.maps.Map(document.getElementById('map')!, {
            center: pyrmont,
            zoom: 17
          });
          var request = {
            location: pyrmont,
            radius: 300,
            type: "restaurant",
            keyword: '飲食店', // 検索地点の付近を`keyword`を使って検索する
          };
          if (google && google.maps && google.maps.places && Map instanceof google.maps.Map) {
            var service = new google.maps.places.PlacesService(Map);
            service.nearbySearch(request, callback);
        } else {
            console.error('Google Maps Places API is not loaded yet or Map is not a google.maps.Map instance');
        }
        } catch (error) {
          alert('検索処理でエラーが発生しました！');
          throw error;
        }
      }
      /**
       * `nearbySearch`のコールバック処理
       *
       */
      function callback(result: any, status: any) {
        let pointLists = [];
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < result.length; i++) {
            pointLists.push({lat: result[i].geometry.location.lat(), lng: result[i].geometry.location.lng()});
          }
        }
        console.log('pointLists:', pointLists);
        sendBackend(pointLists);
        return;
      }
      function sendBackend(pointLists: MarkerPoint[]) {
        // バックエンドに座標を送信
        type RGB = {r: number, g: number, b: number};
        const sendCoordinatesToBackend = async () => {
          try {
            const response = await fetch('http://localhost:5000/save_coordinates', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(coordinatesList)
            });
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json(); // JSONレスポンスをパース
            console.log('data######:', data);
            console.log('data:', data[0].location);
            console.log('data:', data[0].location.lat);
            console.log('data:', data[0].rgb);
            console.log('Coordinates sent successfully');
            // バックエンドから受け取ったRGB値でマーカーを更新
              for (let i = 0; i < data.length; i++) {

                createMarker(data[i].location, data[i].rgb.r, data[i].rgb.g, data[i].rgb.b);

              }
          } catch (error) {
            console.error('Failed to send coordinates to backend', error);
          }
        };
        console.log('pointLists:!!!', pointLists);
        setCoordinatesList(pointLists);
        sendCoordinatesToBackend();
       // バックエンドに座標を送信↑
        return;
      }
      /**
       * 検索結果の箇所にマーカーを設定する
       *
       */
      function createMarker(place :MarkerPoint, r : number, g : number, b : number) {
        // RGB値で色を指定するSVGアイコン
        const svgMarker = {
            path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
            fillColor: `rgb(${r},${g},${b})`, // RGBで色指定
            fillOpacity: 1,
            strokeWeight: 0,
            rotation: 0,
            scale: 2,
            anchor: new google.maps.Point(15, 30),
        };
        // お店情報マーカー
        const markers = new google.maps.Marker({
            map: Map,
            position: place,
            optimized: false,
            icon: svgMarker,  // カスタムアイコンを使用
        });
    }
    return (
        <div>
            {isLoaded ? (
              <div className='wrapper'>
                <div className="logo_search">
                  <div className='logo-container'>
                    <Image src="/image/title_logo.png" alt="logo" width={500} height={100} />
                  </div>
                  <div className='search_wrap'>
                    <input type="text" value={address} onChange={handleInput} className='search-box'/>
                    <button onClick={handleSearch} className='button'>
                      <FontAwesomeIcon icon={faSearch} /> {/* アイコンを表示 */}
                    </button>
                  </div>
                </div>
                <div className='google_map'>
                  <GoogleMap
                    id = 'map'
                    mapContainerStyle={containerStyle}
                    center={location || center}
                    zoom={16}
                    onLoad={onLoad}
                    options={options}
                  >
                  </GoogleMap>
                </div>
              </div>
            ) : (
              <div>Loading...</div>
            )}
        </div>
    );
}
export default GeocodeComponent;
