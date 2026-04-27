from datetime import date, timedelta


class MockAttractionProvider:
    def search(self, city: str, interests: list[str]) -> list[dict]:
        base_tags = interests or ["city_walk", "food"]
        return [
            {"name": f"{city} Museum", "type": "history", "tag": base_tags[0], "recommended_hours": 3},
            {"name": f"{city} Central Park", "type": "nature", "tag": base_tags[-1], "recommended_hours": 2},
            {"name": f"{city} Old Town", "type": "culture", "tag": "must_see", "recommended_hours": 3},
        ]


class MockHotelProvider:
    def search(self, city: str, budget_range: str, accommodation_preference: str) -> dict:
        price_map = {"low": 180, "medium": 320, "high": 680, "budget": 180}
        budget = price_map.get(budget_range, 320)
        return {
            "name": f"{city} {accommodation_preference} Hotel",
            "price_per_night": budget,
            "location": f"{city} city center",
            "rating": 4.5,
        }


class MockWeatherProvider:
    def forecast(self, start_date: date, end_date: date, city: str) -> list[dict]:
        conditions = ["sunny", "cloudy", "light_rain", "moderate_rain"]
        current = start_date
        items: list[dict] = []
        index = 0
        while current <= end_date:
            condition = conditions[index % len(conditions)]
            items.append(
                {
                    "date": current.isoformat(),
                    "city": city,
                    "condition": condition,
                    "high": 26 + index,
                    "low": 18 + index,
                    "risk_score": self._risk_score(condition),
                }
            )
            current += timedelta(days=1)
            index += 1
        return items

    @staticmethod
    def _risk_score(condition: str) -> int:
        mapping = {"sunny": 2, "cloudy": 1, "light_rain": -1, "moderate_rain": -3, "heavy_rain": -5}
        return mapping.get(condition, 0)
