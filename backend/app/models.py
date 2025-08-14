from pydantic import BaseModel
from typing import List

class Location(BaseModel):
    name: str
    x: float
    y: float

class RouteRequest(BaseModel):
    locations: List[Location]

class OptimizedRouteResponse(BaseModel):
    ordered_route: List[Location]
    total_distance: float