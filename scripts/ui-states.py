"""Reproducible UI check for RC4 (Playwright, uses local Chrome).
Usage: start `npm run dev` (port 5173), then `python scripts/ui-states.py docs/evidence/screenshots <phase>`.
Prints the result-card text for 5 scenarios and saves screenshots <phase>-1..4-*.png."""
import sys, json
from playwright.sync_api import sync_playwright
out, phase = sys.argv[1], sys.argv[2]
states = []
with sync_playwright() as p:
    b = p.chromium.launch(channel="chrome")
    pg = b.new_page(viewport={"width": 1100, "height": 760})
    def fresh():
        pg.goto("http://localhost:5173/"); pg.wait_for_selector("input")
    def setv(i, v):
        el = pg.locator("input").nth(i); el.fill(""); 
        if v: el.type(v)
    def status():
        return pg.locator("p.text-lg").inner_text() + " | " + " ".join(pg.locator("p.text-sm").all_inner_texts())
    fresh(); pg.evaluate("document.activeElement && document.activeElement.blur()"); pg.mouse.move(1,1); pg.wait_for_timeout(700); pg.screenshot(path=f"{out}/{phase}-1-default.png"); states.append(("default 555/660/720", status()))
    pg.get_by_role("button", name="Room blocked").click(); pg.evaluate("document.activeElement && document.activeElement.blur()"); pg.mouse.move(1,1); pg.wait_for_timeout(700); pg.screenshot(path=f"{out}/{phase}-2-blocked.png"); states.append(("room blocked", status()))
    fresh(); setv(1, ""); pg.evaluate("document.activeElement && document.activeElement.blur()"); pg.mouse.move(1,1); pg.wait_for_timeout(700); pg.screenshot(path=f"{out}/{phase}-3-empty-start.png"); states.append(("start empty", status()))
    fresh(); setv(0, "0"); setv(1, "6e2"); setv(2, "7e2"); pg.evaluate("document.activeElement && document.activeElement.blur()"); pg.mouse.move(1,1); pg.wait_for_timeout(700); pg.screenshot(path=f"{out}/{phase}-4-exponent-input.png"); states.append(("now=0 start=6e2 end=7e2 (means 600-700, overlaps Intro CS 600-660)", status()))
    fresh(); setv(1, "660.9"); setv(2, "720"); states.append(("start=660.9 end=720", status()))
    b.close()
for k, v in states: print(f"[{phase}] {k} -> {v}")
