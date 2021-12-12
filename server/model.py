import pickle
import pandas as pd
import numpy as np
import tensorflow as tf

initialized = False

def initialize():
    global tokenizer, model, initialized
    
    # Load tokenizer pickle
    with open('./files/tokenizer.pickle', 'rb') as handle:
        tokenizer = pickle.load(handle)
    
    # Load saved model
    model = tf.keras.models.load_model('./files/model.h5', compile = False)

    initilized = True

def tokenize(text):
    sequenced = tokenizer.texts_to_sequences([text])
    return sequenced[0]

def inference(X):
    X = tf.keras.preprocessing.sequence.pad_sequences([X], maxlen = 50, padding = 'post')
    Y = model.predict([X])
    return Y[0]

# This is for debug purpose
def evaluate(x, y):
    X_test = pd.read_csv(x)
    Y_test = pd.read_csv(y)

    print('Shape of data tensor: ', X_test.shape)
    print('Shape of label tensor: ', Y_test.shape)

    scores = model.evaluate(X_test, Y_test)

    data_test = []

    texts = [list(filter(None, lst)) for lst in X_test.values.tolist()]
    labels = [ np.argmax(t) for t in Y_test.values]

    for index, row in X_test.iterrows():
        text = tokenizer.sequences_to_texts([texts[index]])[0]
        data_test.append({
            "tokenized": texts[index],
            "text": text,
            "label": labels[index].item(),
        })


    return scores, data_test
