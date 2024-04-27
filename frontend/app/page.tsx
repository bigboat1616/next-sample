'use client'
import React, { useState, useCallback } from 'react';
import { GoogleMap, InfoWindowF, useJsApiLoader, Marker, useLoadScript } from '@react-google-maps/api';
import { InterfaceMapStyle } from '@/lib/MapStyles';
import GeocodeComponent from './component/search';
// const containerStyle = {
//     width: '1200px',
//     height: '800px'
// };
// type MarkerPoint = {
//     lat: number,
//     lng: number,
//   };
// const center:MarkerPoint= {
//     lat: 36,
//     lng: 140
// };
// const Map = React.memo(() => {
//     const { isLoaded } = useJsApiLoader({
//         id: 'google-map-script',
//         googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY!
//     });
//     const [map, setMap] = useState<google.maps.Map | null>(null);
//     const [maps, setMaps] = useState<google.maps.Map | null>(null);
//     const [geocoder, setGeocoder] = useState<google.maps.Map | null>(null);
//     const [address, setAddress] = useState<google.maps.Map | null>(null);
//     const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(null);
//     const onLoad = useCallback((map: google.maps.Map) => {
//         const bounds = new window.google.maps.LatLngBounds(center);
//         map.fitBounds(bounds);
//         setMap(map);
//     }, []);
//     const onUnmount = useCallback(() => {
//         setMap(null);
//     }, []);
//     const onClick = useCallback((event: google.maps.MapMouseEvent) => {
//         if (event.latLng) {
//             setMarker({
//                 lat: event.latLng.lat(),
//                 lng: event.latLng.lng()
//             });
//         }
//     }, []);
//     const mapOptions = {
//         styles: InterfaceMapStyle
//     };
//     return isLoaded ? (
//         <GoogleMap
//             mapContainerStyle={containerStyle}
//             options={mapOptions}
//             center={center}
//             zoom={50}
//             onLoad={onLoad}
//             onUnmount={onUnmount}
//             onClick={onClick}
//         >
//             {marker && (
//                 <InfoWindowF position={marker}>
//                     <div>
//                         <p>Marker Position</p>
//                     </div>
//                 </InfoWindowF>
//             )}
//             {/* Additional InfoWindowF components */}
//         </GoogleMap>
//     ) : <></>;
// });
const Page = () => {
    return (
        <div>
            <h1>WeitLess</h1>
            <GeocodeComponent/>
            {/* <Map /> */}
        </div>
    );
};
export default Page;



