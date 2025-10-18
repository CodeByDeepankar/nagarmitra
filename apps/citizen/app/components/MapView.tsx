'use client';

import { useMemo, useState } from "react";
import L, { type LatLngExpression } from "leaflet";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { MapPin } from "lucide-react";

import { getAllReports } from "../data/mockData";
import type { Report } from "../types/report";
import { ReportDetailsModal } from "./ReportDetailsModal";
import { Card } from "./ui/card";

import "leaflet/dist/leaflet.css";

const markerShadowUrl = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png";

const pendingIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: markerShadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const inProgressIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl: markerShadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const resolvedIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl: markerShadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const iconCreateFunction = (cluster: { getChildCount(): number }) => {
  const count = cluster.getChildCount();
  let className = "blue-cluster";

  if (count >= 10) {
    className = "red-cluster";
  } else if (count >= 5) {
    className = "yellow-cluster";
  }

  return L.divIcon({
    html: `<div><span>${count}</span></div>`,
    className: `custom-cluster ${className}`,
    iconSize: L.point(40, 40),
  });
};

const FALLBACK_CENTER: LatLngExpression = [19.9, 83.1];

const toLatLng = (report: Report): LatLngExpression => [report.location.lat, report.location.lng];

export function MapView() {
  const reports = useMemo(() => getAllReports(), []);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const pendingReports = useMemo(
    () => reports.filter((report) => report.status === "pending"),
    [reports],
  );

  const inProgressReports = useMemo(
    () => reports.filter((report) => report.status === "in-progress"),
    [reports],
  );

  const resolvedReports = useMemo(
    () => reports.filter((report) => report.status === "resolved"),
    [reports],
  );

  const centerPosition = useMemo<LatLngExpression>(() => {
    if (!reports.length) {
      return FALLBACK_CENTER;
    }

    const totals = reports.reduce(
      (acc, report) => {
        acc.lat += report.location.lat;
        acc.lng += report.location.lng;
        return acc;
      },
      { lat: 0, lng: 0 },
    );

    return [totals.lat / reports.length, totals.lng / reports.length];
  }, [reports]);

  const activeReportCount = reports.filter((report) => report.status !== "resolved").length;

  const handleMarkerClick = (report: Report) => {
    setSelectedReport(report);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedReport(null);
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <h4 className="mb-3 text-slate-700">Map Legend</h4>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="h-4 w-4 rounded-full bg-red-500" />
            <span className="text-slate-600">Pending (clustered)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-4 w-4 rounded-full bg-green-500" />
            <span className="text-slate-600">In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-4 w-4 rounded-full bg-blue-500" />
            <span className="text-slate-600">Resolved</span>
          </div>
        </div>
      </Card>

      <Card className="relative overflow-hidden bg-slate-50">
        <div className="relative h-[600px] w-full">
          <MapContainer center={centerPosition} zoom={13} style={{ height: "600px", width: "100%" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />

            {inProgressReports.map((report) => (
              <Marker
                key={`in-progress-${report.id}`}
                position={toLatLng(report)}
                icon={inProgressIcon}
                eventHandlers={{
                  click: () => handleMarkerClick(report),
                }}
              />
            ))}

            <MarkerClusterGroup iconCreateFunction={iconCreateFunction}>
              {pendingReports.map((report) => (
                <Marker
                  key={`pending-${report.id}`}
                  position={toLatLng(report)}
                  icon={pendingIcon}
                  eventHandlers={{
                    click: () => handleMarkerClick(report),
                  }}
                />
              ))}
            </MarkerClusterGroup>

            {resolvedReports.map((report) => (
              <Marker
                key={`resolved-${report.id}`}
                position={toLatLng(report)}
                icon={resolvedIcon}
                eventHandlers={{
                  click: () => handleMarkerClick(report),
                }}
              />
            ))}
          </MapContainer>
        </div>

        <div className="absolute right-4 top-4 z-[1000] rounded-lg border border-slate-200 bg-white/90 p-3 shadow-lg backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-slate-900">{activeReportCount}</p>
              <p className="text-xs text-slate-600">Active Reports</p>
            </div>
          </div>
        </div>
      </Card>

      <ReportDetailsModal report={selectedReport} open={modalOpen} onClose={handleCloseModal} />

      <style jsx global>{`
        .custom-cluster {
          border-radius: 50%;
          background: #fff;
          text-align: center;
          font-weight: bold;
          line-height: 40px;
          width: 40px;
          height: 40px;
          box-shadow: 0 0 8px rgba(0, 0, 0, 0.15);
        }
        .red-cluster {
          background: #ff4d4f;
          color: #fff;
          border: 2px solid #b71c1c;
        }
        .yellow-cluster {
          background: #ffe066;
          color: #333;
          border: 2px solid #fbc02d;
        }
        .blue-cluster {
          background: #4f8cff;
          color: #fff;
          border: 2px solid #1565c0;
        }
      `}</style>
    </div>
  );
}
