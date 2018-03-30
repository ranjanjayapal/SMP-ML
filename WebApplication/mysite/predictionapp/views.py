from django.shortcuts import render
from django.http import HttpResponse,HttpRequest
from django.views.decorators.csrf import csrf_exempt
import json
import pandas as pd
import numpy as np
from sklearn.svm import SVR
import datetime
import matplotlib.pyplot as plt
import mpld3
import bulbea as bb
import os
from bulbea.learn.evaluation import split
from bulbea.learn.models import RNN
from sklearn.metrics import mean_squared_error
import quandl
import base64
from sklearn.model_selection import train_test_split
# Create your views here.
@csrf_exempt
def predict(request):
    # print(request.body)
    # s = json.dumps(request.body)
    # data = json.loads(s)
    # print(data['years'])
    # print(request.body[len(request.body)-1])
    os.environ["BULBEA_QUANDL_API_KEY"] = 'AENaz-R8uBmUxQsYrLzD'
    quandl.ApiConfig.api_key = 'AENaz-R8uBmUxQsYrLzD'
    now = datetime.datetime.now()
    my_json = request.body.decode('utf8').replace("'", '"')
    data = json.loads(my_json)
    # dataFrameJSON = json.dumps(data["data"], indent=4, sort_keys=True)
    print(data["CompanyName"])
    df = pd.read_json(data["data"], orient='split')
    # print(dataFrameJSON)
    # print(type(df))
    dates = []
    prices = []
    lst_for_result = []
    predictionYear = 0
    predictionType = data["pred_type"]
    if(predictionType == 'Years'):
        predictionYear = now.year + int(data["years"])
        # print(df.index)
        for i in df.index:
            # print(str(i).split()[0].split('-')[2])
            dates.append(int(str(i).split()[0].split('-')[0]))
        for j in df['Close']:
            prices.append(float(str(j)))

    if (predictionType == 'Months'):
        predictionYear = int(data["months"])
        # print(df.index)
        for i in df.index:
            # print(str(i).split()[0].split('-')[2])
            dates.append(int(str(i).split()[0].split('-')[1]))
        for j in df['Close']:
            prices.append(float(str(j)))
    # predictionYear = now.year + int(data["years"])
    # for i in df.index:
    #     # print(str(i).split()[0].split('-')[2])
    #     dates.append(int(str(i).split()[0].split('-')[0]))
    # for j in df['Close']:
    #     prices.append(float(str(j)))
    dates = np.reshape(dates, (len(dates), 1))
    svr_rbf = SVR(kernel='rbf', C=1e3, gamma=0.1)
    svr_rbf.fit(dates, prices)
    predictedValue = svr_rbf.predict(predictionYear)

    share = bb.Share(source='NSE', ticker=data["CompanyName"])
    Xtrain, Xtest, ytrain, ytest = split(share, 'Close', normalize=True)
    Xtrain = pd.DataFrame(Xtrain)
    Xtest = pd.DataFrame(Xtest)
    ytrain = pd.DataFrame(ytrain)
    ytest = pd.DataFrame(ytest)
    Xtrain = Xtrain.dropna(axis=0, how='any')
    Xtest = Xtest.dropna(axis=0, how='any')
    ytrain = ytrain.dropna(axis=0, how='any')
    ytest = ytest.dropna(axis=0, how='any')
    Xtrain = Xtrain.as_matrix()
    Xtest = Xtest.as_matrix()
    ytrain = ytrain.as_matrix()
    ytest = ytest.as_matrix()
    Xtrain = np.reshape(Xtrain, (Xtrain.shape[0], Xtrain.shape[1], 1))
    Xtest = np.reshape(Xtest, (Xtest.shape[0], Xtest.shape[1], 1))
    rnn = RNN([1, 100, 100, 1])  # number of neurons in each layer
    rnn.fit(Xtrain, ytrain)
    p = rnn.predict(Xtest)
    mse = mean_squared_error(ytest, p)
    print(mse)
    fig, ax = plt.subplots()
    ax.plot(ytest)
    ax.plot(p)
    # ax.scatter(dates, prices, color='black', label='Data')
    # ax.plot(dates, svr_rbf.predict(dates), color='red', label='RBF Model')
    # ax.set_xticklabels(dates, rotation=90, ha='left', fontsize=10)
    dictRepPredictionGraph = mpld3.fig_to_dict(fig)
    plt.savefig("/Users/rjmac/Desktop/prediction.png")
    result = {}
    result['predictedValue'] = predictedValue[0]
    result['yearPredicted'] = predictionYear
    with open("/Users/rjmac/Desktop/prediction.png", "rb") as img:
        st = base64.b64encode(img.read())
        print(type(st))
        strng = st.decode("utf-8")
        result['predictionGraph'] = strng
    # lst_for_result.append(result)
    json_data = json.dumps(result)
    return HttpResponse(json_data, content_type='application/json')
    # return HttpResponse("Response from Prediction");
