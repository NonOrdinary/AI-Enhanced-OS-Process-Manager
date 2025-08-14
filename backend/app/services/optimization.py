import math
from typing import List, Tuple
from backend.app.models import Location # <-- Corrected import

def calculate_distance(p1: Location, p2: Location) -> float:
    return math.sqrt((p2.x - p1.x)**2 + (p2.y - p1.y)**2)

def find_optimized_route(locations: List[Location]) -> Tuple[List[Location], float]:
    if not locations:
        return [], 0.0
    start_node = locations[0]
    unvisited = locations[1:]
    ordered_route = [start_node]
    total_distance = 0.0
    current_location = start_node
    while unvisited:
        nearest_location = min(unvisited, key=lambda loc: calculate_distance(current_location, loc))
        dist = calculate_distance(current_location, nearest_location)
        total_distance += dist
        current_location = nearest_location
        ordered_route.append(current_location)
        unvisited.remove(current_location)
    return ordered_route, total_distance