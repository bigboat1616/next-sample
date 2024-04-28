import React, { useState } from 'react';
import { GoogleMap, Marker, useJsApiLoader} from '@react-google-maps/api';

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
        // var service = new google.maps.places.PlacesService(Map);
        let pointLists = [];
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < result.length; i++) {
            // createMarker(result[i], 0, 255, 0);
            pointLists.push({lat: result[i].geometry.location.lat(), lng: result[i].geometry.location.lng()});
            // var request2 = {
            //           placeId: result[i].place_id,
            //           fields: ['name','reviews']
            //         };
            // service.getDetails(request2, callback2);
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
      // function callback2(result: any, status: any) {
      //   let average = 0;
      //   console.log('details:', result);
      //   if (status == google.maps.places.PlacesServiceStatus.OK) {
      //       for (var i = 0; i < result.reviews.length; i++) {
      //           average += result.reviews[i].rating;
      //           // console.log('details:', result.reviews[i].rating, result.reviews[i].text);
      //       }
      //       average = average / result.reviews.length;
      //       // console.log('average:', average);
      //   }
      //   return;
      //   }
        // /**place_idを用いて詳細情報を取得 */
        // function getDetails(place_ids: string[]) {
        //     var service = new google.maps.places.PlacesService(Map);
        //     var request = {
        //       placeId: place_ids[0],
        //       fields: ['name','reviews']
        //     };
        // }
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
            // position: place.geometry.location,
            // title: place.name,
            // label: place.name?.substr(0, 1),
            optimized: false,
            icon: svgMarker,  // カスタムアイコンを使用
        });
    }
    //   function createMarker(place: google.maps.places.PlaceResult) {
    //     if (!place.geometry || !place.geometry.location) return;
    //     // お店情報マーカー
    //     const markers = new google.maps.Marker({
    //       map: Map,
    //       position: place.geometry.location,
    //       title: place.name,
    //       label: place.name?.substr(0, 1),
    //       optimized: false,
    //     });
    // }
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
                <GoogleMap
                  id = 'map'
                  mapContainerStyle={containerStyle}
                  center={location || center}
                  zoom={16}
                  onLoad={onLoad}
                  options={options}
                >
                {/* <Marker position = {markers}/> */}
                  {/* {location && <Marker position={location} />} */}
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
