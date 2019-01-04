/* global google */ 
import React from 'react';
import { connect } from 'react-redux';
import Spinner from 'react-spinkit';
import { withGoogleMap, GoogleMap, withScriptjs, BicyclingLayer, Marker, Polyline  } from 'react-google-maps';
import DrawingManager from "react-google-maps/lib/components/drawing/DrawingManager";
import { saveNewRoutePath } from '../actions/post-routes';
import AddRouteButton from './add-route-button';
import NewRouteForm from './create-routes-form';


class MyBikeMapComponent extends React.Component {

	// renderRouteLoadOrError() {
	// 	if (this.props.loading) {
	// 		return <Spinner spinnername="circle" fadeIn="none" />;
	// 	}

	// 	if (this.props.error) {
	// 			return <strong>{this.props.error}</strong>;
	// 	}
	// 	console.log(this.props.route);
	// }
	currentPolyline;
	onPolylineComplete = poly => {
		this.currentPolyline = poly;
		const polyArray = poly.getPath().getArray();
		let paths = [];
		polyArray.forEach(function(path){
			paths.push({lat: path.lat(), lng: path.lng()});
		});
		this.props.dispatch(saveNewRoutePath(paths));
	}

	removePolyline() {
		this.currentPolyline.setMap(null);
	}

	render() {
		// ---- TODO ---- refactor conditional rendering to functions later 
		// render new route form, clear map
		if (this.props.creatingRoute) {
			return (
				<div>
					<section className="map-container">
						<GoogleMap
						ref={(map) => this._map = map} // allows access to google.maps.Map
						defaultZoom={13}
						defaultCenter={{ lat: 39.753998, lng: -105.001054 }} // set to Denver, later set up geolocation as bonus
						>

							<BicyclingLayer autoUpdate />	

							<DrawingManager 
								onPolylineComplete={(polyline) => {
									this.onPolylineComplete(polyline);
								}}
								defaultDrawingMode={google.maps.drawing.OverlayType.POLYLINE}
								defaultOptions={{
									drawingControl: true,
									drawingControlOptions: {
										position: google.maps.ControlPosition.TOP_CENTER,
										drawingModes: [
											google.maps.drawing.OverlayType.POLYLINE,
											google.maps.drawing.OverlayType.MARKER
										],
									},
									polylineOptions: {
										strokeColor: `#0000ff`,
										strokeOpacity: 1,
										strokeWeight: 5,
										clickable: true,
										editable: true,
										zIndex: 1,
									},
								}}	
							/>

						</GoogleMap>
					</section>

					<div className="new-route-form">
						<NewRouteForm />
					</div>
					
					<button className="clear-map-button"
						onClick={() => {
							if (this.currentPolyline) {
							this.removePolyline();
						}}}
					>
						Clear Map
					</button>
								
				</div>
			);
		}

		// not creating new route, hide form, show button
		if (!this.props.creatingRoute) {

			// clears polyline off map if it exists
			if (this.currentPolyline) {
				this.removePolyline();
			}
			
			return (
				<div>
					<section className="map-container">
						<GoogleMap
							ref={(map) => this._map = map} // allows access to google.maps.Map
							defaultZoom={13}
							defaultCenter={{ lat: 39.753998, lng: -105.001054 }} // set to Denver, later set up geolocation as bonus
						>

							<BicyclingLayer autoUpdate />

							<Polyline 
								defaultOptions={{
									strokeColor: `#0000ff`,
									strokeOpacity: 1,
									strokeWeight: 5,
									clickable: true,
									editable: false, // set up condition to set this to true when user editing route -- extension feature
									zIndex: 1,
								}}   
								path={this.props.currentRoutePath}
							/>
		
							<DrawingManager 
								onPolylineComplete={(e) => {
									this.onPolylineComplete(e);
								}}
								defaultDrawingMode={google.maps.drawing.OverlayType.POLYLINE}
								defaultOptions={{
									drawingControl: true,
									drawingControlOptions: {
										position: google.maps.ControlPosition.TOP_CENTER,
										drawingModes: [
											google.maps.drawing.OverlayType.POLYLINE,
											google.maps.drawing.OverlayType.MARKER
										],
									},
									polylineOptions: {
										strokeColor: `#0000ff`,
										strokeOpacity: 1,
										strokeWeight: 5,
										clickable: true,
										editable: true,
										zIndex: 1,
									},
								}}
							/>
		
						</GoogleMap>
					</section>
					
					<AddRouteButton />

				</div>
				
			)
		}
		// may be pointless, creating route is either true or false
		return (
			<section className="map-container">
				<GoogleMap
					ref={(map) => this._map = map} // allows access to google.maps.Map
					defaultZoom={13}
					defaultCenter={{ lat: 39.753998, lng: -105.001054 }} // set to Denver, later set up geolocation as bonus
				>
					<BicyclingLayer autoUpdate />

					<Polyline 
						defaultOptions={{
							strokeColor: `#0000ff`,
							strokeOpacity: 1,
							strokeWeight: 5,
							clickable: true,
							editable: false, // set up condition to set this to true when user editing route -- extension feature
							zIndex: 1,
						}}   
						path={this.props.currentRoutePath}
					/>

					<DrawingManager 
						onPolylineComplete={(e) => {
							this.onPolylineComplete(e);
						}}
						defaultDrawingMode={google.maps.drawing.OverlayType.POLYLINE}
						defaultOptions={{
							drawingControl: true,
							drawingControlOptions: {
								position: google.maps.ControlPosition.TOP_CENTER,
								drawingModes: [
									google.maps.drawing.OverlayType.POLYLINE,
									google.maps.drawing.OverlayType.MARKER
								],
							},
							polylineOptions: {
								strokeColor: `#0000ff`,
								strokeOpacity: 1,
								strokeWeight: 5,
								clickable: true,
								editable: true,
								zIndex: 1,
							},
						}}
					/>

				</GoogleMap>

				{/* <div>
					{this.renderRouteLoadOrError()}
				</div> */}
				

			</section>
		)
	}
}

const mapStateToProps = state => {
	return {
		routes: state.get.routes,
		loading: state.get.loading,
		error: state.get.error,
		currentRoutePath: state.get.currentRoute.path,
		creatingRoute: state.post.creatingRoute
	}
}

export default connect(mapStateToProps)(withScriptjs(withGoogleMap(MyBikeMapComponent)));