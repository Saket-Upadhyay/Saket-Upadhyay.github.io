---
layout: post
title: Effortless Feature Extraction for your ML based Android Malware Detection project
tags:
  - Malware Detection
  - Machine Learning
---

<div class="message">
Streamline Permission-Based Feature Extraction for android data-set with one Python Script.
</div>

### Background

Malware detection and analysis has been the hot topic in security for a long time, overtime the malware writers upgraded their skills and complexity and this has been the main reason for us to find new effective methodologies for malware detection and classification.

As with the boom of AI and ML to solve general problems,the malware analysis and detection is not left untouched. Many researches has been published in the domain of malware detection using Machine Learning approach. But before doing all the gizmo of model training and neural network formation or any of those wires in brain magic, we need to collect certain information from the target to train our machine, and that is what we call **features** and that is what this article is all about, to get you started in the field.

### Baseline

The following article only focus on feature generation and formatting, specifically permission-based feature generation for android application.

Here we will only see how we can speed up this process by using simple script which Does It All will break it down in some other article where we will discuss feature extraction in general followed my training our own ML model to detect Android malware !

### The Script

Lets get to the fun part, and explore the script itself.

> Get the Project in [GitHub](https://github.com/Saket-Upadhyay/Android-Permission-Extraction-and-Dataset-Creation-with-Python)

This script will extract permission information from Malware and Benign applications in their respective folders and then create one Comma Separated Values (.csv) file to store them in one place ready to be fed into ML algorithms.

### HOW TO USE THE SCRIPT?

Just copy your `Malware` and `Benign` applications on which you want to train your ML Model into `respective folders` and run the script by following command in terminal.

```bash
python3 ExtractorAIO.py
```
And that’s it. yes. done. rest, the script will handle

### HOW TO USE THE GENERATED DATA-SET?

The generated data will be in `*.csv` format and can be parsed with the help of many already available libraries or modules. (pandas module in python is suggested)

#### Formatting

<script src="https://gist.github.com/Saket-Upadhyay/e713aa3fe50fd68895c0b50ebf83508b.js"></script>


<sup>This is sample data set of 6 applications (3 Malware & 3 Benign)</sup>

The 1st column contains **NAME** of respective application and last column **“CLASS”** contains information if the application if from benign or malware family of training set. **[0=Benign, 1=Malware]**. In between there are all the permissions (common + all found in 1st phase) with respective information bit, *[0=The application do not use this permission, 1=This permission is used in the application]*

### Importing Data Example in sklearn

Suppose you want to import your new data set into sklearn and train your new model from there, here’s a way you can do that.

```python
file = pd.read_csv("data.csv")
coulmnNames = file.iloc[1:1, 1:].columns
FeatureNames = list(coulmnNames[1:-1])
LabelName = coulmnNames[-1]
X = file[FeatureNames]
X = np.asarray(X)
Y = file[LabelName]
Y = np.asarray(Y)
feature_vectors = X
labels = Y
train_x, test_x, train_y, test_y = train_test_split(feature_vectors,labels,test_size=0.2)
```
The above code will remove **NAME** column and then store **FEATURE_MATRIX** (from column after  NAME  to second last column) and **LABEL_VECTOR** ( CLASS column) in X and Y respectively, which later can be split into desired training and testing sets.

### CONCLUSION

I hope this article will get you started with feature extraction for malware analysis using machine learning. It isn’t the end of it, but we just completed one step !

---