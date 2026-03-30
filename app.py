from flask import Flask, jsonify, render_template, request

app = Flask(__name__)

# Your Lorcana Database (Mockup)
CARD_DATA = {
    "Wildcat": {
        "name": "Wildcat - Mechanic",
        "ink": "Steel",
        "cost": 3,
        "strength": 2,
        "willpower": 3,
        "lore": 1,
        "type": ["Storyborn", "Ally"],
        "image": "/static/images/wildcat.jpg",
    },
    "DalmationPuppy": {
        "name": "Dalmatian Puppy - Tail Wagger",
        "ink": "Amber",
        "cost": 2,
        "strength": 2,
        "willpower": 3,
        "lore": 1,
        "type": ["Storyborn", "Puppy"],
        "image": "/static/images/puppy.jpg",
    },
    "RobinHood": {
        "name": "Robin Hood - Beloved Outlaw",
        "ink": "Emerald",
        "cost": 1,
        "strength": 2,
        "willpower": 2,
        "lore": 1,
        "type": ["Storyborn", "Hero"],
        "image": "/static/images/robin.jpg",
    },
    "Simba": {
        "name": "Simba - Rightful King",
        "ink": "Steel",
        "cost": 5,
        "strength": 4,
        "willpower": 6,
        "lore": 1,
        "type": ["Storyborn", "Hero", "King"],
        "image": "/static/images/simba.jpg",
    },
    "Stitch": {
        "name": "Stitch - Covert Agent",
        "ink": "Emerald",
        "cost": 5,
        "strength": 3,
        "willpower": 3,
        "lore": 2,
        "type": ["Dreamborn", "Hero", "Alien"],
        "image": "/static/images/stitch.jpg",
    },
}

@app.route("/")
def index():
    return render_template("index.html")


@app.route("/get_card_details", methods=["POST"])
def get_card_details():
    data = request.json
    card_class = data.get("className")

    # Look up the card in our dictionary
    card_info = CARD_DATA.get(card_class)

    if card_info:
        return jsonify({"success": True, "card": card_info})
    return jsonify({"success": False, "error": "Card not found"}), 404


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")
