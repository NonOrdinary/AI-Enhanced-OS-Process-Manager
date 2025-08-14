from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.models import RouteRequest, OptimizedRouteResponse # <-- Corrected import
from backend.app.services.optimization import find_optimized_route # <-- Corrected import

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/optimize-route", response_model=OptimizedRouteResponse)
async def optimize_route_endpoint(request: RouteRequest):
    ordered_route, total_distance = find_optimized_route(request.locations)
    return OptimizedRouteResponse(
        ordered_route=ordered_route,
        total_distance=total_distance
    )