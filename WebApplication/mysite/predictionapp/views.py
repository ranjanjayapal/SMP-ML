from django.shortcuts import render
from django.http import HttpResponse,HttpRequest
from django.views.decorators.csrf import csrf_exempt
import json
import pandas as pd
import numpy as np
from sklearn.svm import SVR
# Create your views here.
@csrf_exempt
def predict(request):
    print(request.body)
    my_json = request.body.decode('utf8').replace("'", '"')
    data = json.loads(my_json)
    dataFrameJSON = json.dumps(data, indent=4, sort_keys=True)
    df = pd.read_json(dataFrameJSON, orient='split')
    print(dataFrameJSON)
    print(type(df))
    dates = []
    prices = []
    lst_for_result = []
    # print(df.index)
    for i in df.index:
        print(str(i).split()[0].split('-')[2])
        dates.append(int(str(i).split()[0].split('-')[1]))
    for j in df['close']:
        prices.append(float(str(j)))
    dates = np.reshape(dates, (len(dates), 1))
    svr_rbf = SVR(kernel='rbf', C=1e3, gamma=0.1)
    svr_rbf.fit(dates, prices)
    predictedValue = svr_rbf.predict(12)
    result = {}
    result['predictedValue'] = predictedValue[0]
    lst_for_result.append(result)
    json_data = json.dumps(result)
    return HttpResponse(json_data, content_type='application/json')
