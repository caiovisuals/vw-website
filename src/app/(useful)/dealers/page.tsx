"use client"

import NotFound from "@/app/not-found"
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api"
import { useRef, useEffect, useMemo } from "react"
import { env } from "@/_lib/env"

export default function Dealers() {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    })

    const mapRef = useRef<google.maps.Map | null>(null)

    const markers = useMemo(() => [
        { id: 1, position: { lat: -15.6561592, lng: -42.3880236 }, title: "Irevel" },
        { id: 2, position: { lat: -16.4374633, lng: -50.4519885 }, title: "Sanave" },
        { id: 3, position: { lat: -13.1069955, lng: -39.5054314 }, title: "Baviera" },
        { id: 4, position: { lat: -12.9736922, lng: -38.5472492 }, title: "Bremen" },
    ], [])

    useEffect(() => {
        if (!mapRef.current || markers.length === 0) return
        const bounds = new window.google.maps.LatLngBounds()
        markers.forEach(marker => bounds.extend(marker.position))
        mapRef.current.fitBounds(bounds)
    }, [markers])
    
    if (loadError) return <NotFound />
    
    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="size-8 border-2 border-[var(--dark-blue)] border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center gap-16 pt-6 md:pt-10 lg:pt-15 xl:pt-20">
            <div className="flex flex-col gap-2 items-center justify-center">
                <h1 className="text-center text-4xl vw-font">Buscar por <span className="font-semibold">Concessionárias</span></h1>
                <h2 className="text-center text-2xl vw-font">Encontre seu ponto oficial de vendas e serviços</h2>
            </div>
            <div className="w-full h-[500px] md:h-[600px]">
                <GoogleMap
                    mapContainerStyle={{ width: "100%", height: "100%", outline: "none", border: "none" }}
                    onLoad={(map) => { mapRef.current = map }}
                >
                    {markers.map((marker) => (
                        <Marker
                            key={marker.id}
                            position={marker.position}
                            title={marker.title}
                        />
                    ))}
                </GoogleMap>
            </div>
        </div>
    )
}