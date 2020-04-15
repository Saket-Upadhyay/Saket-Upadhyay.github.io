---
layout: post
title: Live Movement Tracing in Android using Polygraph Lines
tags:
  - Location Tracing
---

Android already have accurate Geo location capabilities by using multiple sources like Cellular Networks, G.P.S. and nearby Wi-Fi connections. And that’s handful of sources to extract information from, but their working and synchronisation among each other is real beauty.

I also want to share my views on “Location Detection” and “Location Tracing”, there is a difference between “Locating” something and Tracking/Tracing something, android’s pretty accurate in pointing you on globe, and of course we can use classes with some location permissions to request for location information but that would only give us a set of LAT,LON format integers to work with ; from that information we can only point someone/something (cause now-a-days things do have internet) so how to trace that movement?
![Screen Shot 1](https://miro.medium.com/max/500/1*7FVgHe-XObuWDbCOYM4wdA.jpeg "Application Screen Shot")

<div class="message">In this write up i will use my selected location which is less concentrated like city to make things more clear and i had more space to roam here and there in any direction to test the application.</div>

### Some thoughts on Security and Location Tracing
As a citizen of digital age and a cybersecurity student you cannot stop yourself thinking about implementation of things on the field.

As we know knowing someone’s current location can give attacker a high attacking ground but knowing exactly where someone is going with which path is generally followed will help him in creating better plotted trap!

The attacker can know where you are actually going and what’s your daily commute routine and plan accordingly.

#### Prevention?

Just turning off the GPS will not help much, as you will see in this post later, we can get location based on mobile network and nearby wifi networks too.

Just lookout for unknown apps and sudden/ suspicious activation of GPS / Location services. as google tries to get most precise information so it may trigger “Networks+WiFi+GPS High Performance” which you usually can’t miss.


### Idea behind Movement Tracing.

So, the idea is pretty basic and actually we all learn it in our highschool mathematics, and that’s GRAPHS and how plotting works.

We already know that we can get longitudes and latitudes from google itself in our app, just like points on graph of globe, the idea is to collect those points and then make a line from one to each other … easy? yeah its kind of easy.

### Applying Idea via code.

So first we need to get permissions from the user to use location and internet.

> <uses-permission android:name=”android.permission.ACCESS_FINE_LOCATION” />
> <uses-permission android:name=”android.permission.INTERNET” />

after setting up permissions in Manifest.xml, we can proceed further and get our Google API key to use, yeah, to use google maps and related functions we need to grab those, but it’s easy process, here lemme attach a link to a dedicated tutorial if you need.

##### [Google API, Android SDK](https://developers.google.com/maps/documentation/android-sdk/get-api-key)

so, as now you have the keys time to setup our app and get going …

The code is actually long enough to take up 2–3 pages here so I think it would be better to just port the code directly and from GitHub and then modify as it pleases you.

> Get the Repo from [GitHub](https://github.com/Saket-Upadhyay/LiveLocationTriangulation) 

##### Things you need to change in that :

ENTER YOUR API KEY IN app/src/debug/res/values/google_maps_api.xml

```xml
<string name=”google_maps_key” templateMergeStrategy=”preserve” translatable=”false”>YOUR-KEY-HERE</string>
```
And that would just do it.

Clone the Repo and open it up in Android Studio, you may need to change some more code maybe to build it perfectly, cause no code I have ever cloned till now works in first go. ¯\\_(ツ)_/¯


### Let’s understand the working

For the first time I would suggest you to just build the application as it is so that you can follow with this write-up after that feel free to modify the app and use it as it pleases your creativity.

The app is divided in to 3 parts -

* Text Location Update
* Location on Map
* Using Polygraph and Algorithm to trace it on map

### Part 1:

This just tests the location set we can request from Google Maps API and represent them in text, also we can get which MODE is used in the process (GPS,NETWORK,WIFI).
![Screen Shot2.jpg](https://miro.medium.com/max/1400/1*DAv3Pe_cFAZATxCxcu7GTg.jpeg "Screen Shot2")

### Part 2:

This part integrates “Google Maps Activity” layout already available in Android Studio. The idea is to collect information from provider and then pass it to Maps Activity which will then place a marker on that location.
![Screen Shot3.jpg](https://miro.medium.com/max/1400/1*wq792anmgYKQ29zK10ONvw.jpeg "Screen Shot3")

### Part 3:

Well this is main section of the application which actually traces your location on map.

The steps executed in this part are important,

    1. Get location from provider
    2. Set Red marker on starting point / initial location
    3. Set Location Listener to check for location change
    4. When ever location change is detected will add a point over map
    5. Draw line joining those points
    6. Place Green marker over last point.
    7. Loop 1–6 until application is closed / location provide is not available.

Check out this Code for a moment …

```java
package locationpolymorph.test.sacredcoder.livelocationtriangulation;

import android.Manifest;
import android.app.Activity;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.location.Address;
import android.location.Geocoder;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Build;
import android.support.annotation.RequiresApi;
import android.support.v4.app.ActivityCompat;
import android.support.v4.app.FragmentActivity;
import android.os.Bundle;
import android.view.WindowManager;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.BitmapDescriptorFactory;
import com.google.android.gms.maps.model.JointType;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;
import com.google.android.gms.maps.model.Polyline;
import com.google.android.gms.maps.model.PolylineOptions;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class PolyMap extends FragmentActivity implements OnMapReadyCallback {

    private GoogleMap mMap;
    Marker marker;
    Marker marker2;
    LocationListener locationListener;
    LocationManager locationManager;
    protected static final int REQUEST_LOCATION_PERMISSION = 1;

    //for line
    private Polyline polyline;
    private Activity activity;
    private Boolean flag=true;

    private List<LatLng> polylinePoints;
    @RequiresApi(api = Build.VERSION_CODES.P)
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_poly_map);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        // Obtain the SupportMapFragment and get notified when the map is ready to be used.
        SupportMapFragment mapFragment = (SupportMapFragment) getSupportFragmentManager()
                .findFragmentById(R.id.mapp);
        mapFragment.getMapAsync(this);
        polylinePoints = new ArrayList<>();
        locationManager = (LocationManager) getSystemService(LOCATION_SERVICE);
        if (ActivityCompat.checkSelfPermission(this,
                Manifest.permission.ACCESS_FINE_LOCATION)
                != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this, new String[]
                            {Manifest.permission.ACCESS_FINE_LOCATION},
                    REQUEST_LOCATION_PERMISSION);
        }
//polyline.setColor(Color.GREEN);

        locationListener = new LocationListener() {
            @Override
            public void onLocationChanged(Location location) {

                //if(location.hasAccuracy()) {
                  //  if (location.getAccuracy() < 20.0f) {
                        double latitude = location.getLatitude();
                        double longitude = location.getLongitude();

                        //get the location name from latitude and longitude
                        Geocoder geocoder = new Geocoder(getApplicationContext());
                        try {
                            List<Address> addresses =
                                    geocoder.getFromLocation(latitude, longitude, 1);
                            String result = addresses.get(0).getLocality() + ":";
                            result += addresses.get(0).getCountryName();
                            LatLng latLng = new LatLng(latitude, longitude);


                            if (flag) {
                                marker2 = mMap.addMarker(new MarkerOptions().position(latLng).title(result).icon(BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_ROSE)));
                            }


                            if (marker != null) {
                                marker.remove();

                                marker = mMap.addMarker(new MarkerOptions().position(latLng).title(result).icon(BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_GREEN)));
                                mMap.setMaxZoomPreference(20);
                                mMap.moveCamera(CameraUpdateFactory.newLatLngZoom(latLng, 18.0f));

                            } else {
                                marker = mMap.addMarker(new MarkerOptions().position(latLng).title(result).icon(BitmapDescriptorFactory.defaultMarker(120.0f)));
                                mMap.setMaxZoomPreference(20);
                                mMap.moveCamera(CameraUpdateFactory.newLatLngZoom(latLng, 18.0f));
                            }

                            polylinePoints.add(latLng);


                            if (polyline != null) {
                                polyline.setPoints(polylinePoints);

                            } else {
                                polyline = mMap.addPolyline(new PolylineOptions().addAll(polylinePoints).color(Color.MAGENTA).jointType(JointType.ROUND).width(3.0f));
                            }

                            flag = false;


                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                  //  }
                //}
            }

            @Override
            public void onStatusChanged(String provider, int status, Bundle extras) {

            }

            @Override
            public void onProviderEnabled(String provider) {

            }

            @Override
            public void onProviderDisabled(String provider) {

            }
        };
        locationManager.requestLocationUpdates(LocationManager.NETWORK_PROVIDER, 0, 0, locationListener);
        locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 0, 0, locationListener);
    }
    //TO MANAGE THE MAP AS ONE WHEN THE MAP VIEW IS AVAILABLE FOR THE USER.

    @Override
    public void onMapReady(GoogleMap googleMap) {
        mMap = googleMap;
        mMap.setMapType(mMap.MAP_TYPE_SATELLITE);

    }

    @Override
    protected void onStop() {
        super.onStop();
        locationManager.removeUpdates(locationListener);
    }

    //CLOSE THE SESSION WHEN THE BACK IS PRESSED.
    @Override
    public void onBackPressed()
    {
        super.onBackPressed();
        this.finish();
    }
}
```


We can see here what ‘Location Listener’ is actually doing,

```java
locationListener = new LocationListener() { @Override public void onLocationChanged(Location location)
```

It is also interesting to see how we choose most precise location provider available

```java
public void onProviderDisabled(String provider) { } };locationManager.requestLocationUpdates(LocationManager.NETWORK_PROVIDER, 0, 0, locationListener); locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 0, 0, locationListener); }
```

The next thing in this code to notice is how we are managing Polygraph Lines and Markers together to create lines on map

```java
import com.google.android.gms.maps.model.Marker;   
import com.google.android.gms.maps.model.MarkerOptions; 
import com.google.android.gms.maps.model.Polyline;    
import com.google.android.gms.maps.model.PolylineOptions;
```
next comes the code for step 2,4 and 5

```java
if (marker != null) {
marker.remove();
marker = mMap.addMarker(new MarkerOptions().position(latLng).title(result).icon(BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_GREEN)));
mMap.setMaxZoomPreference(20);
mMap.moveCamera(CameraUpdateFactory.newLatLngZoom(latLng, 18.0f));
} else {
marker = mMap.addMarker(new MarkerOptions().position(latLng).title(result).icon(BitmapDescriptorFactory.defaultMarker(120.0f)));
mMap.setMaxZoomPreference(20);
mMap.moveCamera(CameraUpdateFactory.newLatLngZoom(latLng, 18.0f));
}
polylinePoints.add(latLng);
```
here we check marker position and add new points to our PolyLine
```java
if (polyline != null) {
  polyline.setPoints(polylinePoints);
} else {
polyline = mMap.addPolyline(new PolylineOptions().addAll(polylinePoints).color(Color.MAGENTA).jointType(JointType.ROUND).width(3.0f));
}  
flag = false;
} catch (IOException e) {e.printStackTrace();                           
}
```

above code checks PolyLine and draws it over GoogleMap activity.

Compiling all above steps and logic, we got a cute and precise trace line over Satellite Map.

![Sat. Trace SS.jpg](https://miro.medium.com/max/1000/1*qpEIDypfzkTvHotYjn6Tdw.jpeg "Sat Screenshot")

### What next?

Well… Now you know how to trace location over maps, like a cool modern cartographer 😬. Your imagination is the limit.

some ideas :

* The points of polygraphs, if stored in arrays or any of your fav. data structure can be passed to your database and then share that with your other apps to live track group of friends together.
* Can run this service in background to store data points and then draw them whenever needed.