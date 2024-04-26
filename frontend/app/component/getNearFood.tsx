import React, { useState } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
  /**
   * 近場のご飯屋さんを検索して表示
   *
   */
  function getNearFood(lat: number, lng: number, Map: google.maps.Map | null) {
    if (document.getElementById('map') == null || typeof document.getElementById('map') == null) {
      return;
    } // マップがなかったら処理させない
    try {
      let pyrmont = new google.maps.LatLng(
        parseFloat(lat.toString()),
        parseFloat(lng.toString()),
      );
      // キーワード検索で取得できた位置の緯度軽度を使用してMapを再生成
      Map = new google.maps.Map(document.getElementById('map')!, {
        center: pyrmont,
        zoom: 17
      });
      let request = {
        location: pyrmont,
        radius: 500,
        type: "restaurant",
        keyword: '居酒屋', // 検索地点の付近を`keyword`を使って検索する
      };
      // Mapオブジェクトを使用してPlacesAPIを生成
      let service = new google.maps.places.PlacesService(Map);
      // PlacesAPIのnearbySearch使って再度リクエスト
      service.nearbySearch(request, callback);
    } catch (error) {
    console.error('検索処理でエラーが発生しました', error);
  // UI上にフレンドリーなエラーメッセージを表示する処理を追加
}
  }
   /**
   * `nearbySearch`のコールバック処理
   *
   */
   function callback(result: any, status: any) {
    let numbers = [];
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < result.length; i++) {
        // コールバックで受け取ったデータを配列に格納
        numbers.push(result[i]);
      }
    }
    return numbers;
  }
  export default callback;
























