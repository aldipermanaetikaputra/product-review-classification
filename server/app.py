from flask import Flask, json, request, jsonify, render_template
import os
import server.preprocessing as preprocessing
import server.model as model
import server.data as data

threshold_coverage = 0.6
threshold_classification = 0.6

app = Flask(__name__, static_folder="../html/static", template_folder="../html")

@app.route('/')
def serve():
    return render_template('index.html')

@app.route('/review', methods=['GET'])
def inference_review():
  text = request.args.get('text')
  
  if not model.initialized:
      model.initialize()
  
  processed = preprocessing.clean(text)
  tokenized = model.tokenize(processed)
  inferenced = model.inference(tokenized)

  processed_length = len(processed.split(" ")) * 1.0

  if processed_length > 0 and len(tokenized) / processed_length >= threshold_coverage:
    if inferenced[0] >= threshold_classification:
        result = "negative"
    elif inferenced[1] >= threshold_classification:
        result = "positive"
    else:
        result = "dilemma"
  else:
      result = "uncoverage"

  response = jsonify({
      "result": result,
      "original": text,
      "processed": processed,
      "tokenized": tokenized,
      "classification": inferenced.tolist(),
  })
  response.headers.add('Access-Control-Allow-Origin', '*')
  return response

@app.route('/evaluate', methods=['POST'])
def model_evaluate():
    x = request.files.get('x')
    y = request.files.get('y')

    scores, data_test = model.evaluate(x, y)

    return jsonify({
        "accuaration": round(scores[1] * 100),
        "test": data_test,
    })


@app.route('/random', methods=['GET'])
def random_review():
    total = int(request.args.get('total'))
    random = data.random_review(total).values.tolist()

    response = jsonify(random)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response