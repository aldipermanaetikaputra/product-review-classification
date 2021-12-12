import pandas as pd

data_balanced = pd.read_csv("./files/data_balanced.csv")

def random_review(total = 1):
    random = data_balanced.sample(total)
    return random["raw"]