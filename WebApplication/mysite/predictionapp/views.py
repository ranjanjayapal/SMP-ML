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
# Create your views here.
@csrf_exempt
def predict(request):
    # print(request.body)
    # s = json.dumps(request.body)
    # data = json.loads(s)
    # print(data['years'])
    # print(request.body[len(request.body)-1])
    now = datetime.datetime.now()
    my_json = request.body.decode('utf8').replace("'", '"')
    data = json.loads(my_json)
    # dataFrameJSON = json.dumps(data["data"], indent=4, sort_keys=True)
    print(data["years"])
    df = pd.read_json(data["data"], orient='split')
    # print(dataFrameJSON)
    # print(type(df))
    dates = []
    prices = []
    lst_for_result = []
    predictionYear = now.year + int(data["years"])
    # print(df.index)
    for i in df.index:
        # print(str(i).split()[0].split('-')[2])
        dates.append(int(str(i).split()[0].split('-')[0]))
    for j in df['close']:
        prices.append(float(str(j)))
    dates = np.reshape(dates, (len(dates), 1))
    svr_rbf = SVR(kernel='rbf', C=1e3, gamma=0.1)
    svr_rbf.fit(dates, prices)
    predictedValue = svr_rbf.predict(predictionYear)
    fig, ax = plt.subplots()
    ax.scatter(dates, prices, color='black', label='Data')
    ax.plot(dates, svr_rbf.predict(dates), color='red', label='RBF Model')
    ax.set_xticklabels(dates, rotation=90, ha='left', fontsize=10)
    dictRepPredictionGraph = mpld3.fig_to_dict(fig)
    result = {}
    result['predictedValue'] = predictedValue[0]
    result['yearPredicted'] = predictionYear
    # result['predictionGraph'] = dictRepPredictionGraph
    # lst_for_result.append(result)
    json_data = json.dumps(result)
    return HttpResponse(json_data, content_type='application/json')
    # return HttpResponse("Response from Prediction");
