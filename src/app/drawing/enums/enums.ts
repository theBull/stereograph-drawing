/// <reference path='../common.ts' />

module Common.Enums {
	
	export enum ImpaktDataTypes {
		Unknown = 0,
		PlaybookView = 1,
		Playbook = 2,
		Formation = 3,
		Set = 4,

		Play = 10,

		PlayTemplate = 98,
		Variant = 99,

		Team = 200,

		GenericEntity = 1000,
		League = 1010,
		Season = 1011,
		Opponent = 1012,
		Game = 1013,
		Position = 1014,
		PersonnelGroup = 1015,
		TeamMember = 1016,
		UnitType = 1017,
		Conference = 1018,
		Division = 1019,
		Scenario = 1020,
		MatchupPlaybook = 1021,
		Situation = 1022,
		Assignment = 1023,
		AssignmentGroup = 1024,
		GamePlan = 1030,
		PracticePlan = 1031,
		PracticeSchedule = 1032,
		ScoutCard = 1033,
		Drill = 1034,
		QBWristband = 1035,
		Plan = 1039,
		GameAnalysis = 1050,
		PlayByPlayAnalysis = 1051,

		Location = 1101,

		GenericSetting = 2000,
		User = 2010,
		SecureUser = 2011,
		Account = 2020,
		Organization = 2021
	}

	export enum State {
		Unknown,
		Ready,
		Loaded,
		Initialized,
		Constructed,
		Updating
	}

	export enum AssociationTypes {
		Any = -1,
		Unknown = 0,
		Peer = 1,
		Dependency = 2
	}

	export enum DimensionTypes {
		Square,
		Circle,
		Ellipse
	}

	/**
	 * Allows the canvas to be scaled/sized differently.
	 * To specify an initial canvas size, for example,
	 * Canvas is initialized with MaxContainerWidth,
	 * which causes the canvas to determine its width based
	 * on the current maximum width of its parent container. On the
	 * contrary, the canvas can be told to set its width based
	 * on a given, target grid cell size. For example, if the target
	 * grid width is 20px and the grid is 50 cols, the resulting
	 * canvas width will calculate to 1000px.
	 */
	export enum CanvasSizingModes {
		TargetGridWidth,
		MaxContainerWidth,
		PreviewWidth
	}

	export class CursorTypes {
		static pointer = 'pointer';
		static crosshair = 'crosshair';
	}

	export enum SetTypes {
		None,
		Personnel,
		Assignment,
		UnitType
	}

	export enum LayerTypes {
		Generic,
		FieldElement,
		Player,
		PlayerIcon,
		PlayerPersonnelLabel,
		PlayerIndexLabel,
		PlayerCoordinates,
		PlayerRelativeCoordinatesLabel,
		PlayerSelectionBox,
		PlayerRoute,
		PlayerSecondaryRoutes,
		PlayerAlternateRoutes,
		PlayerRouteAction,
		PlayerRouteNode,
		PlayerRoutePath,
		PlayerRouteControlPath,

		PrimaryPlayer,
		PrimaryPlayerIcon,
		PrimaryPlayerLabel,
		PrimaryPlayerCoordinates,
		PrimaryPlayerRelativeCoordinatesLabel,
		PrimaryPlayerSelectionBox,
		PrimaryPlayerRoute,
		PrimaryPlayerSecondaryRoutes,
		PrimaryPlayerAlternateRoutes,
		PrimaryPlayerRouteAction,
		PrimaryPlayerRouteNode,
		PrimaryPlayerRoutePath,
		PrimaryPlayerRouteControlPath,

		OpponentPlayer,
		OpponentPlayerIcon,
		OpponentPlayerLabel,
		OpponentPlayerCoordinates,
		OpponentPlayerRelativeCoordinatesLabel,
		OpponentPlayerSelectionBox,
		OpponentPlayerRoute,
		OpponentPlayerSecondaryRoutes,
		OpponentPlayerAlternateRoutes,
		OpponentPlayerRouteAction,
		OpponentPlayerRouteNode,
		OpponentPlayerRoutePath,
		OpponentPlayerRouteControlPath,

		Ball,
		Field,
		Sideline,
		Hashmark,
		SidelineHashmark,
		Endzone,
		LineOfScrimmage,
		Assignment
	}

	export enum RouteTypes {
        None,
        Generic,
        Block,
        Scan,
        Run,
        Route,
        Cover,
        Zone,
        Spy,
        Option,
        HandOff,
        Pitch
    }

    export enum RenderTypes {
    	Preview,
    	Editor,
    	Unknown
    }

	export enum RouteNodeTypes {
        None,
        Normal,
        Root,
        CurveStart,
        CurveControl,
        CurveEnd,
        End
    }

    export enum RouteNodeActions {
        None,
        Block,
        Delay,
        Continue,
        Juke,
        ZigZag
    }

    export enum Actions {
    	None,
    	Create,
    	Save,
    	Overwrite,
    	Copy,
    	Edit,
    	Update,
    	Delete,
    	View,
    	Details,
    	Select
    }
}