'use client'
import React from 'react'
import { GoogleMap, InfoWindowF, useJsApiLoader } from '@react-google-maps/api'
import { InterfaceMapStyle } from '@/lib/MapStyles'

const containerStyle = {
    width: '1200px',
    height: '800px'
}

const center = {
    lat: 36,
    lng: 140
}

const Map = React.memo(() => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY!
    })

    const [map, setMap] = React.useState(null)

    const onLoad = React.useCallback(function callback(map: any) {
        // This is just an example of getting and using the map instance!!! don't just blindly copy!
        const bounds = new window.google.maps.LatLngBounds(center)
        map.fitBounds(bounds)

        setMap(map)
    }, [])

    const onUnmount = React.useCallback(function callback(map: any) {
        setMap(null)
    }, [])

    const mapOptions = {
        styles: InterfaceMapStyle
    }

    return isLoaded ? (
        <GoogleMap
            mapContainerStyle={containerStyle}
            options={mapOptions}
            center={center}
            zoom={10}
            onLoad={onLoad}
            onUnmount={onUnmount}
        >
            <InfoWindowF position={center}>
                <>
                    <p>川本･計良研究室</p>
                    <img
                        width="100px"
                        src="https://www.kawa-lab.org/wordpress/wp-content/uploads/2016/08/logo.png"
                        alt=""
                    />
                </>
            </InfoWindowF>
            <InfoWindowF position={{ lat: 35.62630103837421, lng: 140.1159142044246 }}>
                <>
                    <p>龍之介</p>
                    <p>5分待ち</p>
                </>
            </InfoWindowF>
            <InfoWindowF position={{ lat: 35.62406779026565, lng: 140.10121058980235 }}>
                <>
                    <p>はん歩</p>
                    <p>5分待ち</p>
                </>
            </InfoWindowF>
            <InfoWindowF position={{ lat: 35.62377319704928, lng: 140.10337833307406 }}>
                <>
                    <p>北京亭</p>
                    <p>15分待ち</p>
                </>
            </InfoWindowF>
            <InfoWindowF position={{ lat: 35.62215870364333, lng: 140.10323825145724 }}>
                <>
                    <p>SAWASUKE</p>
                    <p>30分待ち</p>
                </>
            </InfoWindowF>
            <InfoWindowF position={{ lat: 35.62304983241853, lng: 140.1073376318148 }}>
                <>
                    <p>幸せのれんげ</p>
                    <p>0分待ち</p>
                </>
            </InfoWindowF>

        </GoogleMap>
    ) : (
        <></>
    )
})

const Page = () => {
    return (
        <div>
            <h1>Google Map from Next App</h1>
            <Map />
        </div>
    )
}

export default Page
