from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


TWO_SUM_CODE = """def two_sum(nums, target):
    seen = {}

    for i, num in enumerate(nums):
        complement = target - num

        if complement in seen:
            return [seen[complement], i]

        seen[num] = i

    return []
"""


def test_health_check() -> None:
    response = client.get("/api/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_two_sum_trace() -> None:
    response = client.post(
        "/api/trace",
        json={
            "code": TWO_SUM_CODE,
            "function_name": "two_sum",
            "args": [[2, 7, 11, 15], 9],
            "kwargs": {},
        },
    )

    body = response.json()

    assert response.status_code == 200
    assert body["result"] == [0, 1]
    assert len(body["steps"]) > 0
    assert body["steps"][0]["event"] == "call"
    assert body["steps"][-1]["event"] == "return"
    assert body["steps"][-1]["return_value"] == [0, 1]