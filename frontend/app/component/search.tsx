import React, { useState } from 'react';
import { GoogleMap, Marker, useJsApiLoader} from '@react-google-maps/api';
// import getNearFood from './getNearFood';
let Map: google.maps.Map;
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
        libraries : ['places'],
    });
    const [address, setAddress] = useState('');
    const [location, setLocation] = useState<MarkerPoint | null>(null);
    const [markers, setMarkers] = useState<MarkerPoint>(center);
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
        var service = new google.maps.places.PlacesService(Map);
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < result.length; i++) {
            createMarker(result[i]);
            console.log('place_id:', result[i].place_id)
            var request2 = {
                      placeId: result[i].place_id,
                      fields: ['name','reviews']
                    };
            service.getDetails(request2, callback2);
          }
        }
        return;
      }
      function callback2(result: any, status: any) {
        let average = 0;
        console.log('details:', result);
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < result.reviews.length; i++) {
                average += result.reviews[i].rating;
                console.log('details:', result.reviews[i].rating, result.reviews[i].text);
            }
            average = average / result.reviews.length;
            console.log('average:', average);
        }
        return;
        }
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
      function createMarker(place: google.maps.places.PlaceResult) {
        if (!place.geometry || !place.geometry.location) return;
        // お店情報マーカー
        const marker = new google.maps.Marker({
          map: Map,
          position: place.geometry.location,
          title: place.name,
          label: place.name?.substr(0, 1),
          optimized: false,
        });
    }
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
                <Marker position = {markers}/>
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