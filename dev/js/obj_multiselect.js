// start of file
/**
	Multi-Select
	Wrapper object to be used by the UI to handle
	actions that pertain to many selected shapes
	or path points.
**/



//-------------------------------------------------------
// Selected Shapes
//-------------------------------------------------------
	function MultiSelect(){
		this.members = [];
	}

	MultiSelect.prototype.select = function(obj) {
		this.members = [obj];
	};

	MultiSelect.prototype.clear = function(){
		this.members = [];
	};

	MultiSelect.prototype.add = function(obj){
		if(this.members.indexOf(obj) < 0) this.members.push(obj);
	};

	MultiSelect.prototype.remove = function(obj) {
		for(var m=0; m<this.members.length; m++){
			if(this.members[m] === obj) {
				this.members.splice(m, 1);
			}
		}
	};

	MultiSelect.prototype.toggle = function(obj) {
		if(this.isSelected(obj)) this.remove(obj);
		else this.add(obj);
	};

	MultiSelect.prototype.getType = function() {
		if(this.members.length === 0) return false;
		else if(this.members.length === 1) return this.members[0].objtype;
		else return 'multi';
	};

	MultiSelect.prototype.count = function() {
		return this.members.length;
	};

	MultiSelect.prototype.getMembers = function() {
		return this.members;
	};

	MultiSelect.prototype.getSingleton = function() {
		if(this.members.length === 1) return this.members[0];
		else return false;
	};

	MultiSelect.prototype.isSelected = function(obj) {
		for(var m=0; m<this.members.length; m++){
			if(this.members[m] === obj) return true;
		}

		return false;
	};


//-------------------------------------------------------
// Multiselect SHAPES
//-------------------------------------------------------

	// Initialize fake Glyph of multiselected shapes
	_UI.ss = new MultiSelect();
	_UI.ss.glyph = new Glyph({'name': 'multiselected shapes'});
	_UI.ss.glyph.hlock = false;
	_UI.ss.glyph.wlock = false;

	_UI.ss.getGlyph = function() {
		this.glyph.shapes = this.members;
		this.glyph.calcGlyphMaxes();
		return this.glyph;
	};

	// Wrapper functions
	_UI.ss.updateShapePosition = function(dx, dy, force){ this.getGlyph().updateGlyphPosition(dx, dy, force); };

	_UI.ss.setShapePosition = function(nx, ny, force) { this.getGlyph().setGlyphPosition(nx, ny, force); };

	_UI.ss.updateShapeSize = function(dx, dy, force) { this.getGlyph().updateGlyphSize(dx, dy, force); };

	_UI.ss.setShapeSize = function(nw, nh, ratiolock) { this.getGlyph().setGlyphSize(nw, nh, ratiolock); };

	_UI.ss.updateShapeSize = function(dw, dh, ratiolock) { this.getGlyph().updateGlyphSize(dw, dh, ratiolock); };

	_UI.ss.flipNS = function(mid) { this.getGlyph().flipNS(mid); };

	_UI.ss.flipEW = function(mid) { this.getGlyph().flipEW(mid); };

	_UI.ss.isOverBoundingBoxHandle = function(px, py) {
		// debug('\n SelectedShapes.isOverBoundingBoxHandle - START');
		// debug('\t passed x/y: ' + px + '/' + py);
		if(this.members.length === 1) {
			// debug('\t calling singleton method');
			return this.members[0].isOverBoundingBoxHandle(px, py);
		}

		var c = isOverBoundingBoxHandle(px, py, this.getGlyph().maxes, _UI.multiselectthickness);
		// debug('\t SelectedShapes.isOverBoundingBoxHandle returning ' + c);
		return c;
	};

	_UI.ss.calcMaxes = function(){
		for(var m=0; m<this.members.length; m++){
			this.members[m].calcMaxes();
		}
	};

	_UI.ss.getMaxes = function(){
		if(this.members.length === 1) return this.members[0].getMaxes();
		else return this.getGlyph().maxes;
	};

	_UI.ss.drawShape = function(lctx, view){
		for(var m=0; m<this.members.length; m++){
			this.members[m].drawShape(lctx, view);
		}
	};

	_UI.ss.drawSelectOutline = function(){
		if(this.members.length === 1){
			this.members[0].drawSelectOutline();
		} else {
			for(var m=0; m<this.members.length; m++){
				this.members[m].drawSelectOutline(false, _UI.multiselectthickness);
			}
		}
	};

	_UI.ss.drawBoundingBox = function(){
		if(this.members.length === 1){
			this.members[0].drawBoundingBox();
		} else if(this.members.length > 1){
			var bmaxes = clone(_UI.mins);

			for(var m=0; m<this.members.length; m++){
				bmaxes = getOverallMaxes([bmaxes, this.members[m].getMaxes()]);
			}

			drawBoundingBox(bmaxes, _UI.colors.gray, _UI.multiselectthickness);
		}
	};

	_UI.ss.drawBoundingBoxHandles = function(){
		if(this.members.length === 1){
			this.members[0].drawBoundingBoxHandles();
		} else if(this.members.length > 1){
			var bmaxes = clone(_UI.mins);

			for(var m=0; m<this.members.length; m++){
				bmaxes = getOverallMaxes([bmaxes, this.members[m].getMaxes()]);
			}

			drawBoundingBoxHandles(bmaxes, _UI.colors.gray, _UI.multiselectthickness);
		}
	};

	// This is a hack
	_UI.ss.sp = function(){
		if(this.members[0]) return this.members[0].path.sp();
		else return false;
	};


//-------------------------------------------------------
// Multiselect PATH POINTS
//-------------------------------------------------------

// end of file