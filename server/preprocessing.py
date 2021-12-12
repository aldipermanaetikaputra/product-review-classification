import pandas as pd
import re
import string
from Sastrawi.Stemmer.StemmerFactory import StemmerFactory

class DataCleaning:
  # Initialization
  factory     = StemmerFactory()
  stemmer     = factory.create_stemmer()
  kamus_alay1 = pd.read_csv('https://raw.githubusercontent.com/fendiirfan/Kamus-Alay/main/Kamu-Alay.csv')
  kamus_alay1 = kamus_alay1.set_index('kataAlay')
  kamus_alay2 = pd.read_csv('https://raw.githubusercontent.com/nasalsabila/kamus-alay/master/colloquial-indonesian-lexicon.csv')
  kamus_alay2 = kamus_alay2.filter(['slang', 'formal'], axis=1)
  kamus_alay2 = kamus_alay2.drop_duplicates(subset=['slang'], keep='first')
  kamus_alay2 = kamus_alay2.set_index('slang')
  stopword   = list(pd.read_csv('https://raw.githubusercontent.com/datascienceid/stopwords-bahasa-indonesia/master/stopwords_id_satya.txt', header = None)[0])

  @classmethod
  def CleanDataFrame(cls, df, col_name, label_name, minimum_kata=0, label_mapping=None, dropna=False, stem=False, stop=False):

    final_list_clean = []
    final_list_kotor = []
    final_label = []

    i = 0
    current = 0
    
    while i < len(df):
      current_kalimat = str(df.iloc[i][col_name])
      current_label = df.iloc[i][label_name]

      clean_kalimat = cls.__cleanSentence__(current_kalimat, stem, stop)
      if type(clean_kalimat) != str or clean_kalimat == None or clean_kalimat == "":
        clean_kalimat = ""
      if (len(clean_kalimat.split(' ')) >= minimum_kata):
        final_list_clean.append(str(clean_kalimat))
        final_list_kotor.append(str(current_kalimat))
        if label_mapping != None:
          final_label.append(label_mapping[current_label])
        else:
          final_label.append(current_label)
        current += 1

        if current % 5000 == 0:
          print("Memproses {} data".format(current))

      i += 1
    
    data = {
        'raw': final_list_kotor,
        'processed': final_list_clean,
        'label': final_label
    }

    final_df = pd.DataFrame(data)
    if dropna:
      print("NaN Dropped")
      final_df = final_df.dropna(how='any')

    final_df['processed'] = final_df['processed'].astype(str)
    final_df['raw'] = final_df['raw'].astype(str)
    return final_df

  @classmethod
  def __cleanSentence__(cls, text, stem, stop):

    temp_text = list(text)
    for i in range(len(temp_text)):
      if temp_text[i] in string.punctuation:
        temp_text[i] = " "

    text = ''.join(temp_text)

    #will consider only alphabets
    text = re.sub('[^a-zA-Z]',' ',text) 
    #will replace newline with space
    text = re.sub("\n"," ",text)
    #will convert to lower case
    text = text.lower()
    # will repalce repated char
    text = re.sub(r'(\w)(\1{2,})', r"\1", text)
    # will replace space more than one
    text = re.sub('(s{2,})',' ',text)
    # will join the words
    text=' '.join(text.split())

    # unformal word to formal
    text_split = text.split(' ')
    for i in range(len(text_split)):
      if text_split[i] in cls.kamus_alay1.index:
        text_split[i] = cls.kamus_alay1.loc[text_split[i]]['kataBaik']
      elif text_split[i] in cls.kamus_alay2.index:
        text_split[i] = cls.kamus_alay2.loc[text_split[i]]['formal']

    # remove stopword
    if stop:
      temp_text_split = []
      for i in range(len(text_split)):
        if (text_split[i] not in cls.stopword):
          temp_text_split.append(text_split[i])

      final_text = ' '.join(temp_text_split)
    else:
      final_text = ' '.join(text_split)

    

    if stem: return cls.stemmer.stem(str(final_text))
    else: return final_text

def clean(text):
  cleaned = DataCleaning.__cleanSentence__(text, stem=True, stop=False)
  return cleaned