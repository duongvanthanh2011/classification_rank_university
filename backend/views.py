from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

import pandas as pd
from joblib import load
from numpy import log1p


class PredictAPIView(APIView):
    # Load data encoding
    df_uni_loc = pd.read_csv(r"Data\Uni_Loc_Encode.csv")
    df_rank = pd.read_csv(r"Data\UniversityRank_Encode.csv")

    # Load model
    model_dt = load("./Model/decisiontreeModel.joblib")
    model_svm = load("./Model/svmModel.joblib")
    model_rf = load("./Model/randomforestModel.joblib")

    def post(self, request):
        data = request.data

        name_university = data['Name of University']
        encode_university = self.df_uni_loc[self.df_uni_loc['Name of University'] == name_university]

        data['Name of University'] = encode_university['Name of University_lbEncode'].iloc[0]
        data['Location'] = encode_university['Location_lbEncode'].iloc[0]
        data['No of student'] = log1p(data['No of student'])
        data['No of student per staff'] = log1p(data['No of student'])
        data['Male Ratio'] = 100 - data['Female Ratio']

        df_input = pd.DataFrame([data]).reindex(['Name of University', 'Location', 'No of student',
       'No of student per staff', 'International Student', 'Teaching Score',
       'Research Score', 'Citations Score', 'Industry Income Score',
       'International Outlook Score', 'OverAll Score Min', 'OverAll Score Max',
       'Female Ratio', 'Male Ratio'],axis=1)
        
        result_dt = self.model_dt.predict(df_input)[0]
        result_decode_dt = self.df_rank["University Rank"][self.df_rank["University Rank_lbEncode"] == result_dt]

        result_rf = self.model_rf.predict(df_input)[0]
        result_decode_rf = self.df_rank["University Rank"][self.df_rank["University Rank_lbEncode"] == result_rf]

        result_svm = self.model_svm.predict(df_input)[0]
        result_decode_svm = self.df_rank["University Rank"][self.df_rank["University Rank_lbEncode"] == result_svm]

        # Trả về response với dữ liệu dự đoán từ ba mô hình
        return Response({
            "prediction_model_1": result_decode_dt,
            "prediction_model_2": result_decode_rf,
            "prediction_model_3": result_decode_svm
        }, status=status.HTTP_200_OK)
        
    def get(self, request):
        return Response({
            "universities":sorted(self.df_uni_loc['Name of University'].unique()),
        },status=status.HTTP_200_OK)
