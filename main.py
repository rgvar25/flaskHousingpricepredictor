
from flask import Flask, request, jsonify, render_template
import func

app = Flask(__name__)


@app.route('/')
def home():
   return render_template('index.html')

#Render locations in Locations tab
@app.route("/locations")
def get_location():
    response = jsonify({
        'locations':func.get_location_names()
        })
   
    return response


#Predict with the model
@app.route("/predict", methods=['POST'])
def predict():
   
    total_sqft = float(request.form['total_sqft'])
    location = request.form['location']
    bhk = int(request.form['bhk'])
    bath = int(request.form['bath'])
    
    response = jsonify({
        'estimated_price': func.get_estimated_price(location, total_sqft, bhk, bath)
        })
    
    
    return response

if __name__ == "__main__":
    print('Server up and running')
    func.load_data()
    app.run()
    