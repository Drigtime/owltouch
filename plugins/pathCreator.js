var icon = {
    top: {
        move: L.icon({
            iconUrl: "./data/assets/path/move/top.svg",
            className: "top-arrow"
        }),
        gather: L.icon({
            iconUrl: "./data/assets/path/gather/top.svg",
            className: "top-arrow"
        }),
        fight: L.icon({
            iconUrl: "./data/assets/path/fight/top.svg",
            className: "top-arrow"
        }),
        bank: L.icon({
            iconUrl: "./data/assets/path/bank/top.svg",
            className: "top-arrow"
        }),
        phoenix: L.icon({
            iconUrl: "./data/assets/path/phoenix/top.svg",
            className: "top-arrow"
        })
    },
    left: {
        move: L.icon({
            iconUrl: "./data/assets/path/move/left.svg",
            className: "left-arrow"
        }),
        gather: L.icon({
            iconUrl: "./data/assets/path/gather/left.svg",
            className: "left-arrow"
        }),
        fight: L.icon({
            iconUrl: "./data/assets/path/fight/left.svg",
            className: "left-arrow"
        }),
        bank: L.icon({
            iconUrl: "./data/assets/path/bank/left.svg",
            className: "left-arrow"
        }),
        phoenix: L.icon({
            iconUrl: "./data/assets/path/phoenix/left.svg",
            className: "left-arrow"
        })
    },
    bottom: {
        move: L.icon({
            iconUrl: "./data/assets/path/move/bottom.svg",
            className: "bottom-arrow"
        }),
        gather: L.icon({
            iconUrl: "./data/assets/path/gather/bottom.svg",
            className: "bottom-arrow"
        }),
        fight: L.icon({
            iconUrl: "./data/assets/path/fight/bottom.svg",
            className: "bottom-arrow"
        }),
        bank: L.icon({
            iconUrl: "./data/assets/path/bank/bottom.svg",
            className: "bottom-arrow"
        }),
        phoenix: L.icon({
            iconUrl: "./data/assets/path/phoenix/bottom.svg",
            className: "bottom-arrow"
        })
    },
    right: {
        move: L.icon({
            iconUrl: "./data/assets/path/move/right.svg",
            className: "right-arrow"
        }),
        gather: L.icon({
            iconUrl: "./data/assets/path/gather/right.svg",
            className: "right-arrow"
        }),
        fight: L.icon({
            iconUrl: "./data/assets/path/fight/right.svg",
            className: "right-arrow"
        }),
        bank: L.icon({
            iconUrl: "./data/assets/path/bank/right.svg",
            className: "right-arrow"
        }),
        phoenix: L.icon({
            iconUrl: "./data/assets/path/phoenix/right.svg",
            className: "right-arrow"
        })
    },
    havenbag: {
        move: L.icon({
            iconUrl: "./data/assets/path/move/bag.svg",
            className: "havenbag-icon"
        }),
        gather: L.icon({
            iconUrl: "./data/assets/path/gather/bag.svg",
            className: "havenbag-icon"
        }),
        fight: L.icon({
            iconUrl: "./data/assets/path/fight/bag.svg",
            className: "havenbag-icon"
        }),
        bank: L.icon({
            iconUrl: "./data/assets/path/bank/bag.svg",
            className: "havenbag-icon"
        }),
        phoenix: L.icon({
            iconUrl: "./data/assets/path/phoenix/bag.svg",
            className: "havenbag-icon"
        })
    },
    hint: {
        phenix: L.icon({
            iconUrl: "./data/assets/hint/phoe.png",
            className: "hint-icon"
        }),
        bank: L.icon({
            iconUrl: "./data/assets/hint/bank.png",
            className: "hint-icon"
        })
    }
};

var actualMap;
var pathData = [];
var pathLinearData = [];
var bankData = [];
var phenixData = [];
var havenBagData = [];
var phenixPos = [{ map: "12,12", cellid: "184", marker: void 0 }, { map: "7,36", cellid: "0", marker: void 0 }, { map: "22,22", cellid: "272", marker: void 0 }, { map: "10,19", cellid: "192", marker: void 0 }, { map: "5,1", cellid: "0", marker: void 0 }, { map: "2,-1", cellid: "0", marker: void 0 }, { map: "13,-7", cellid: "0", marker: void 0 }, { map: "5,-9", cellid: "116", marker: void 0 }, { map: "2,-14", cellid: "313", marker: void 0 }, { map: "-6,-12", cellid: "0", marker: void 0 }, { map: "36,10", cellid: "330", marker: void 0 }, { map: "25,-4", cellid: "450", marker: void 0 }, { map: "27,-33", cellid: "0", marker: void 0 }, { map: "24,-43", cellid: "245", marker: void 0 }, { map: "17,-36", cellid: "0", marker: void 0 }, { map: "-13,-29", cellid: "0", marker: void 0 }, { map: "-10,-54", cellid: "342", marker: void 0 }, { map: "-33,-56", cellid: "0", marker: void 0 }, { map: "-10,13", cellid: "354", marker: void 0 }, { map: "-14,31", cellid: "243", marker: void 0 }, { map: "-26,34", cellid: "0", marker: void 0 }, { map: "-26,36", cellid: "0", marker: void 0 }, { map: "-55,40", cellid: "240", marker: void 0 }, { map: "-58,18", cellid: "354", marker: void 0 }, { map: "-60,-3", cellid: "0", marker: void 0 }, { map: "-43,0", cellid: "259", marker: void 0 }, { map: "-41,-17", cellid: "0", marker: void 0 }, { map: "-43,-19", cellid: "0", marker: void 0 }, { map: "-53,-40", cellid: "0", marker: void 0 }, { map: "-67,-44", cellid: "219", marker: void 0 }, { map: "-60,-79", cellid: "0", marker: void 0 }];
var bankPos = [{ map: "4,-18", marker: void 0 }, { map: "24,-36", marker: void 0 }, { map: "2,-2", marker: void 0 }, { map: "14,25", marker: void 0 }, { map: "-27,35", marker: void 0 }, { map: "-47,21", marker: void 0 }, { map: "-16,4", marker: void 0 }, { map: "-31,-54", marker: void 0 }, { map: "-77,-41", marker: void 0 }];
var havenToggle = false;

function checkMaps(mapcoord, array) {
    for (let key = 0; key < array.length; key++) {
        if (array[key].map == mapcoord) {
            return true;
        }
    }
    return false;
}

function getMapIndex(mapcoord, array) {
    for (let key = 0; key < array.length; key++) {
        if (array[key].map == mapcoord) {
            return key;
        }
    }
}

function onMapClick() {

    actualMap = actualMap = $('#mapCoordinates')[0].innerText.split(', ') ? !loadingFile : actualMap;
    
    if ($('.fa-suitcase.toggled').length > 0) {
        if (!havenToggle) {
            if (!checkMaps(actualMap[0] + ',' + actualMap[1], havenBagData)) {
                havenToggle = true;
                $('#havenBagSetting').appendTo("body").modal('show');
                return;
            } else {
                havenBagData.splice(getMapIndex(actualMap[0] + ',' + actualMap[1], havenBagData), 1);
            }
        } else {
            havenToggle = false;
        }
    }
    if ($('.fa-eraser.toggled').length > 0) {
        let deleteAll = function (array, index) {
            if (array[index] !== undefined) {
                if (array[index].top)
                    if (array[index].top.icon) map.removeLayer(array[index].top.icon);
                if (array[index].bottom)
                    if (array[index].bottom.icon) map.removeLayer(array[index].bottom.icon);
                if (array[index].left)
                    if (array[index].left.icon) map.removeLayer(array[index].left.icon);
                if (array[index].right)
                    if (array[index].right.icon) map.removeLayer(array[index].right.icon);
                if (array[index].havenbag)
                    if (array[index].havenbag.icon) map.removeLayer(array[index].havenbag.icon);
                array.splice(index, 1);
            }
        };
        deleteAll(pathData, getMapIndex(actualMap, pathData));
        deleteAll(pathLinearData, getMapIndex(actualMap, pathLinearData));
        deleteAll(bankData, getMapIndex(actualMap, bankData));
        deleteAll(phenixData, getMapIndex(actualMap, phenixData));
        deleteAll(havenBagData, getMapIndex(actualMap, havenBagData));
    } else if ($(".fa-university.toggled").length > 0) {
        if (!checkMaps(actualMap, bankData)) {
            if ($(".fa-suitcase.toggled").length > 0) {
                if (checkMaps(actualMap, pathData)) {
                    removeArrow(getMapIndex(actualMap, pathData), pathData);
                    deleteEmptyPath(pathData);
                } else if (checkMaps(actualMap, phenixData)) {
                    removeArrow(getMapIndex(actualMap, phenixData), phenixData);
                    deleteEmptyPath(phenixData);
                }
            }
            bankData.push({
                map: actualMap,
                top: {
                    path: false,
                    icon: undefined
                },
                bottom: {
                    path: false,
                    icon: undefined
                },
                right: {
                    path: false,
                    icon: undefined
                },
                left: {
                    path: false,
                    icon: undefined
                },
                havenbag: {
                    path: false,
                    icon: undefined
                },
                bank: false
            });
            createMarker(getMapIndex(actualMap, bankData), bankData);
            deleteEmptyPath(bankData);
        } else {
            removeArrow(getMapIndex(actualMap, bankData), bankData);
            deleteEmptyPath(bankData);
        }
        console.clear();
        for (let key in bankData) {
            console.log(key + ', map : ' + bankData[key].map + ', top : ' + bankData[key].top.path + ', bottom : ' + bankData[key].bottom.path + ', right : ' + bankData[key].right.path + ', left : ' + bankData[key].left.path + ', havenbag : ' + bankData[key].havenbag.path);
        }
    } else if ($(".fa-fire.toggled").length > 0) {
        if (!checkMaps(actualMap, phenixData)) {
            if ($(".fa-suitcase.toggled").length > 0) {
                if (checkMaps(actualMap, pathData)) {
                    removeArrow(getMapIndex(actualMap, pathData), pathData);
                    deleteEmptyPath(pathData);
                } else if (checkMaps(actualMap, bankData)) {
                    removeArrow(getMapIndex(actualMap, bankData), bankData);
                    deleteEmptyPath(bankData);
                }
            }
            phenixData.push({
                map: actualMap,
                top: {
                    path: false,
                    icon: undefined
                },
                bottom: {
                    path: false,
                    icon: undefined
                },
                right: {
                    path: false,
                    icon: undefined
                },
                left: {
                    path: false,
                    icon: undefined
                },
                havenbag: {
                    path: false,
                    icon: undefined
                },
                phenix: false
            });
            createMarker(getMapIndex(actualMap, phenixData), phenixData);
            deleteEmptyPath(phenixData);
        } else {
            removeArrow(getMapIndex(actualMap, phenixData), phenixData);
            deleteEmptyPath(phenixData);
        }
        console.clear();
        for (let key in phenixData) {
            console.log(key + ', map : ' + phenixData[key].map + ', top : ' + phenixData[key].top.path + ', bottom : ' + phenixData[key].bottom.path + ', right : ' + phenixData[key].right.path + ', left : ' + phenixData[key].left.path + ', havenbag : ' + phenixData[key].havenbag.path);
        }
    } else {
        if (!checkMaps(actualMap, pathData)) {
            if ($(".fa-suitcase.toggled").length > 0) {
                if (checkMaps(actualMap, bankData)) {
                    removeArrow(getMapIndex(actualMap, bankData), bankData);
                    deleteEmptyPath(bankData);
                } else if (checkMaps(actualMap, phenixData)) {
                    removeArrow(getMapIndex(actualMap, phenixData), phenixData);
                    deleteEmptyPath(phenixData);
                }
            }
            if ($(".fa-random.toggled").length > 0) {
                if (!checkMaps(actualMap, pathLinearData)) {
                    pathLinearData.push({
                        map: actualMap,
                        top: {
                            index: undefined,
                            path: false,
                            icon: undefined
                        },
                        bottom: {
                            index: undefined,
                            path: false,
                            icon: undefined
                        },
                        right: {
                            index: undefined,
                            path: false,
                            icon: undefined
                        },
                        left: {
                            index: undefined,
                            path: false,
                            icon: undefined
                        },
                        havenbag: {
                            index: undefined,
                            path: false,
                            icon: undefined
                        },
                        gather: false,
                        fight: false,
                        index: false
                    });
                    createMarker(getMapIndex(actualMap, pathLinearData), pathLinearData);
                    deleteEmptyPath(pathLinearData);
                } else {
                    removeArrow(getMapIndex(actualMap, pathLinearData), pathLinearData);
                    deleteEmptyPath(pathLinearData);
                }
            } else {
                pathData.push({
                    map: actualMap,
                    top: {
                        path: false,
                        icon: undefined
                    },
                    bottom: {
                        path: false,
                        icon: undefined
                    },
                    right: {
                        path: false,
                        icon: undefined
                    },
                    left: {
                        path: false,
                        icon: undefined
                    },
                    havenbag: {
                        path: false,
                        icon: undefined
                    },
                    gather: false,
                    fight: false,
                });
                createMarker(getMapIndex(actualMap, pathData), pathData);
                deleteEmptyPath(pathData);
            }
        } else {
            removeArrow(getMapIndex(actualMap, pathData), pathData);
            deleteEmptyPath(pathData);
        }
        console.clear();
        for (let key in pathData) {
            console.log(key + ', map : ' + pathData[key].map + ', top : ' + pathData[key].top.path + ', bottom : ' + pathData[key].bottom.path + ', right : ' + pathData[key].right.path + ', left : ' + pathData[key].left.path + ', havenbag : ' + pathData[key].havenbag.path + ', gather : ' + pathData[key].gather + ', fight : ' + pathData[key].fight);
        }
    }
}

function deleteEmptyPath(array) {
    if (!array[getMapIndex(actualMap, array)].top.path && !array[getMapIndex(actualMap, array)].bottom.path && !array[getMapIndex(actualMap, array)].left.path && !array[getMapIndex(actualMap, array)].right.path && !array[getMapIndex(actualMap, array)].havenbag.path) {
        array.splice(getMapIndex(actualMap, array), 1);
    }
}

function removeArrow(key, array) {
    removeArrowWay(key, array, "fa-arrow-up", "top");
    removeArrowWay(key, array, "fa-arrow-left", "left");
    removeArrowWay(key, array, "fa-arrow-down", "bottom");
    removeArrowWay(key, array, "fa-arrow-right", "right");
    removeArrowWay(key, array, "fa-suitcase", "havenbag");
}

function removeArrowWay(key, array, className, iconType) {
    if ($('.' + className + '.toggled').length > 0) {
        if ($(".fa-random.toggled").length > 0) {
            if (array[key][iconType].icon !== undefined) {
                if (array[key].index == 4) {
                    if (iconType == "top") {
                        if (array[key].top.index == 1) {
                            if (array[key].bottom.index > 1) array[key].bottom.index -= 1;
                            if (array[key].left.index > 1) array[key].left.index -= 1;
                            if (array[key].right.index > 1) array[key].right.index -= 1;
                        } else if (array[key].top.index == 2) {
                            if (array[key].bottom.index > 2) array[key].bottom.index -= 1;
                            if (array[key].left.index > 2) array[key].left.index -= 1;
                            if (array[key].right.index > 2) array[key].right.index -= 1;
                        } else if (array[key].top.index == 3) {
                            if (array[key].bottom.index > 3) array[key].bottom.index -= 1;
                            if (array[key].left.index > 3) array[key].left.index -= 1;
                            if (array[key].right.index > 3) array[key].right.index -= 1;
                        }
                    } else if (iconType == "bottom") {
                        if (array[key].bottom.index == 1) {
                            if (array[key].top.index > 1) array[key].top.index -= 1;
                            if (array[key].left.index > 1) array[key].left.index -= 1;
                            if (array[key].right.index > 1) array[key].right.index -= 1;
                        } else if (array[key].bottom.index == 2) {
                            if (array[key].top.index > 2) array[key].top.index -= 1;
                            if (array[key].left.index > 2) array[key].left.index -= 1;
                            if (array[key].right.index > 2) array[key].right.index -= 1;
                        } else if (array[key].bottom.index == 3) {
                            if (array[key].top.index > 3) array[key].top.index -= 1;
                            if (array[key].left.index > 3) array[key].left.index -= 1;
                            if (array[key].right.index > 3) array[key].right.index -= 1;
                        }
                    } else if (iconType == "left") {
                        if (array[key].left.index == 1) {
                            if (array[key].top.index > 1) array[key].top.index -= 1;
                            if (array[key].bottom.index > 1) array[key].bottom.index -= 1;
                            if (array[key].right.index > 1) array[key].right.index -= 1;
                        } else if (array[key].left.index == 2) {
                            if (array[key].top.index > 2) array[key].top.index -= 1;
                            if (array[key].bottom.index > 2) array[key].bottom.index -= 1;
                            if (array[key].right.index > 2) array[key].right.index -= 1;
                        } else if (array[key].left.index == 3) {
                            if (array[key].top.index > 3) array[key].top.index -= 1;
                            if (array[key].bottom.index > 3) array[key].bottom.index -= 1;
                            if (array[key].right.index > 3) array[key].right.index -= 1;
                        }
                    } else if (iconType == "right") {
                        if (array[key].right.index == 1) {
                            if (array[key].top.index > 1) array[key].top.index -= 1;
                            if (array[key].left.index > 1) array[key].left.index -= 1;
                            if (array[key].bottom.index > 1) array[key].bottom.index -= 1;
                        } else if (array[key].right.index == 2) {
                            if (array[key].top.index > 2) array[key].top.index -= 1;
                            if (array[key].left.index > 2) array[key].left.index -= 1;
                            if (array[key].bottom.index > 2) array[key].bottom.index -= 1;
                        } else if (array[key].right.index == 3) {
                            if (array[key].top.index > 3) array[key].top.index -= 1;
                            if (array[key].left.index > 3) array[key].left.index -= 1;
                            if (array[key].bottom.index > 3) array[key].bottom.index -= 1;
                        }
                    }
                } else if (array[key].index == 3) {
                    if (iconType == "top") {
                        if (array[key].top.index == 1) {
                            if (array[key].bottom.index > 1) array[key].bottom.index -= 1;
                            if (array[key].left.index > 1) array[key].left.index -= 1;
                            if (array[key].right.index > 1) array[key].right.index -= 1;
                        } else if (array[key].top.index == 2) {
                            if (array[key].bottom.index > 2) array[key].bottom.index -= 1;
                            if (array[key].left.index > 2) array[key].left.index -= 1;
                            if (array[key].right.index > 2) array[key].right.index -= 1;
                        }
                    } else if (iconType == "bottom") {
                        if (array[key].bottom.index == 1) {
                            if (array[key].top.index > 1) array[key].top.index -= 1;
                            if (array[key].left.index > 1) array[key].left.index -= 1;
                            if (array[key].right.index > 1) array[key].right.index -= 1;
                        } else if (array[key].bottom.index == 2) {
                            if (array[key].top.index > 2) array[key].top.index -= 1;
                            if (array[key].left.index > 2) array[key].left.index -= 1;
                            if (array[key].right.index > 2) array[key].right.index -= 1;
                        }
                    } else if (iconType == "left") {
                        if (array[key].left.index == 1) {
                            if (array[key].top.index > 1) array[key].top.index -= 1;
                            if (array[key].bottom.index > 1) array[key].bottom.index -= 1;
                            if (array[key].right.index > 1) array[key].right.index -= 1;
                        } else if (array[key].left.index == 2) {
                            if (array[key].top.index > 2) array[key].top.index -= 1;
                            if (array[key].bottom.index > 2) array[key].bottom.index -= 1;
                            if (array[key].right.index > 2) array[key].right.index -= 1;
                        }
                    } else if (iconType == "right") {
                        if (array[key].right.index == 1) {
                            if (array[key].top.index > 1) array[key].top.index -= 1;
                            if (array[key].left.index > 1) array[key].left.index -= 1;
                            if (array[key].bottom.index > 1) array[key].bottom.index -= 1;
                        } else if (array[key].right.index == 2) {
                            if (array[key].top.index > 2) array[key].top.index -= 1;
                            if (array[key].left.index > 2) array[key].left.index -= 1;
                            if (array[key].bottom.index > 2) array[key].bottom.index -= 1;
                        }
                    }
                } else if (array[key].index == 2) {
                    if (iconType == "top") {
                        if (array[key].top.index == 1) {
                            if (array[key].bottom.index > 1) array[key].bottom.index -= 1;
                            if (array[key].left.index > 1) array[key].left.index -= 1;
                            if (array[key].right.index > 1) array[key].right.index -= 1;

                        }
                    } else if (iconType == "bottom") {
                        if (array[key].bottom.index == 1) {
                            if (array[key].top.index > 1) array[key].top.index -= 1;
                            if (array[key].left.index > 1) array[key].left.index -= 1;
                            if (array[key].right.index > 1) array[key].right.index -= 1;

                        }
                    } else if (iconType == "left") {
                        if (array[key].left.index == 1) {
                            if (array[key].top.index > 1) array[key].top.index -= 1;
                            if (array[key].bottom.index > 1) array[key].bottom.index -= 1;
                            if (array[key].right.index > 1) array[key].right.index -= 1;

                        }
                    } else if (iconType == "right") {
                        if (array[key].right.index == 1) {
                            if (array[key].top.index > 1) array[key].top.index -= 1;
                            if (array[key].left.index > 1) array[key].left.index -= 1;
                            if (array[key].bottom.index > 1) array[key].bottom.index -= 1;
                        }
                    }
                }
                array[key].index -= 1;
                array[key][iconType].index = undefined;
                array[key][iconType].path = false;
                map.removeLayer(array[key][iconType].icon);
                array[key][iconType].icon = undefined;
            } else if (iconType == "havenbag") {
            } else createMarkerWay(key, array, className, iconType);
        } else if (array[key][iconType].icon !== undefined) {
            array[key][iconType].path = false;
            map.removeLayer(array[key][iconType].icon);
            array[key][iconType].icon = undefined;
        } else if (iconType == "havenbag") {
        } else createMarkerWay(key, array, className, iconType);
    }
}

function createMarker(key, array) {
    createMarkerWay(key, array, "fa-arrow-up", "top");
    createMarkerWay(key, array, "fa-arrow-left", "left");
    createMarkerWay(key, array, "fa-arrow-down", "bottom");
    createMarkerWay(key, array, "fa-arrow-right", "right");
    createMarkerWay(key, array, "fa-suitcase", "havenbag");
}

function createMarkerWay(key, array, className, iconType) {
    if ($('.' + className + '.toggled').length > 0) {
        if ($(".fa-leaf.toggled").length > 0) {
            if (iconType == "havenbag") {
                array[key][iconType].icon = L.marker(dofusXYToMapXY(actualMap[0], actualMap[1]), {
                    interactive: true,
                    zIndexOffset: 5000,
                    icon: icon[iconType].gather
                }).addTo(map).bindPopup('Téléportation au zaap map : ' + havenBagData[havenBagData.length - 1].mapToGo + ' | mapID : ' + havenBagData[havenBagData.length - 1].mapidToGo);
            } else {
                array[key][iconType].icon = L.marker(dofusXYToMapXY(actualMap[0], actualMap[1]), {
                    interactive: false,
                    zIndexOffset: 5000,
                    icon: icon[iconType].gather
                }).addTo(map);
            }
            array[key].gather = true;
        } else if ($(".fa-shield-alt.toggled").length > 0) {
            if (iconType == "havenbag") {
                array[key][iconType].icon = L.marker(dofusXYToMapXY(actualMap[0], actualMap[1]), {
                    interactive: true,
                    zIndexOffset: 5000,
                    icon: icon[iconType].fight
                }).addTo(map).bindPopup('Téléportation au zaap map : ' + havenBagData[havenBagData.length - 1].mapToGo + ' | mapID : ' + havenBagData[havenBagData.length - 1].mapidToGo);
            } else {
                array[key][iconType].icon = L.marker(dofusXYToMapXY(actualMap[0], actualMap[1]), {
                    interactive: false,
                    zIndexOffset: 5000,
                    icon: icon[iconType].fight

                }).addTo(map);
            }
            array[key].fight = true;
        } else if ($(".fa-university.toggled").length > 0) {
            if (iconType == "right" || iconType == "left") {
                array[key][iconType].icon = L.marker(dofusXYToMapXY(actualMap[0], actualMap[1] * 1 + (0.2)), {
                    interactive: false,
                    zIndexOffset: 4500,
                    icon: icon[iconType].bank
                }).addTo(map);
            } else if (iconType == "top" || iconType == "bottom") {
                array[key][iconType].icon = L.marker(dofusXYToMapXY(actualMap[0] * 1 + (0.1), actualMap[1]), {
                    interactive: false,
                    zIndexOffset: 4500,
                    icon: icon[iconType].bank
                }).addTo(map);
            } else if (iconType == "havenbag") {
                array[key][iconType].icon = L.marker(dofusXYToMapXY(actualMap[0], actualMap[1]), {
                    interactive: true,
                    zIndexOffset: 5000,
                    icon: icon[iconType].bank
                }).addTo(map).bindPopup('Téléportation au zaap map : ' + havenBagData[havenBagData.length - 1].mapToGo + ' | mapID : ' + havenBagData[havenBagData.length - 1].mapidToGo);
            }
            array[key].bank = true;
        } else if ($(".fa-fire.toggled").length > 0) {
            if (iconType == "right" || iconType == "left") {
                array[key][iconType].icon = L.marker(dofusXYToMapXY(actualMap[0], actualMap[1] * 1 - (0.2)), {
                    interactive: false,
                    zIndexOffset: 4000,
                    icon: icon[iconType].phoenix
                }).addTo(map);
            } else if (iconType == "top" || iconType == "bottom") {
                array[key][iconType].icon = L.marker(dofusXYToMapXY(actualMap[0] * 1 - (0.1), actualMap[1]), {
                    interactive: false,
                    zIndexOffset: 4000,
                    icon: icon[iconType].phoenix
                }).addTo(map);
            } else if (iconType == "havenbag") {
                array[key][iconType].icon = L.marker(dofusXYToMapXY(actualMap[0], actualMap[1]), {
                    interactive: true,
                    zIndexOffset: 5000,
                    icon: icon[iconType].phoenix
                }).addTo(map).bindPopup('Téléportation au zaap map : ' + havenBagData[havenBagData.length - 1].mapToGo + ' | mapID : ' + havenBagData[havenBagData.length - 1].mapidToGo);
            }
            array[key].phenix = true;
        } else {
            if (iconType == "havenbag") {
                array[key][iconType].icon = L.marker(dofusXYToMapXY(actualMap[0], actualMap[1]), {
                    interactive: true,
                    zIndexOffset: 5000,
                    icon: icon[iconType].move
                }).addTo(map).bindPopup('Téléportation au zaap map : ' + havenBagData[havenBagData.length - 1].mapToGo + ' | mapID : ' + havenBagData[havenBagData.length - 1].mapidToGo);
            } else {
                array[key][iconType].icon = L.marker(dofusXYToMapXY(actualMap[0], actualMap[1]), {
                    interactive: false,
                    zIndexOffset: 5000,
                    icon: icon[iconType].move
                }).addTo(map);
            }
        }
        if ($(".fa-random.toggled").length > 0) {
            array[key].index += 1;
            array[key][iconType].index = array[key].index;
            array[key][iconType].path = true;
        } else {
            array[key][iconType].path = true;
        }
    }
}

function pathGenerator(index, array) {
    var path = "";
    if (index !== undefined) {
        if (array.length !== 0) {
            if (array[index].havenbag.path)
                // && !array[index].bank)
                path = "havenbag";
            else {
                if (array[index].top.path)
                    path = "top";
                if (array[index].bottom.path)
                    path += (path === "" ? "" : "|") + "bottom";
                if (array[index].left.path)
                    path += (path === "" ? "" : "|") + "left";
                if (array[index].right.path)
                    path += (path === "" ? "" : "|") + "right";
            }
            return path;
        }
    }
}

function checkPhenixPos(map) {
    for (let key in phenixPos) {
        if (map == phenixPos[key].map) {
            return [true, key];
        }
    }
    return false;
}

function gatherFigh(index, array) {
    var path = "";
    if (array[index].gather)
        path = ", gather = true";
    if (array[index].fight)
        path += ", fight = true";
    return path;
}

function havenbagCheck(option) {
    for (let index = 0; index < havenBagData.length; index++) {
        if (havenBagData[index][option]) {
            return true;
        }
    }
    return false;
}

function getLinearAction(params, key) {
    if (pathLinearData[key].top.index == params) {
        return "top";
    } else if (pathLinearData[key].left.index == params) {
        return "left";
    } else if (pathLinearData[key].bottom.index == params) {
        return "bottom";
    } else if (pathLinearData[key].right.index == params) {
        return "right";
    } else if (pathLinearData[key].havenbag.index == params) {
        return "havenbag";
    }
}

$('#path-creator-bar').on('click', '.fa-save', function () {
    var firstIf = false;
    var txt = "-- Generated On Dofus-Map with Drigtime's SwiftPath Script Maker --\r\n" +
        "-- Nom : " + $('#file-name-field').val() + "\r\n" +
        "-- Zone : " + $('#area-field').val() + "\r\n" +
        "-- Type : " + ($('#type-field').val() ? $('#type-field').val() : "") + "\r\n" +
        "-- Version : " + $('#version-field').val() + "\r\n" +
        "-- Auteur : " + $('#author-field').val() + "\r\n\r\n" +
        "GATHER = {" + ($('#ressources-selecter').val() ? $('#ressources-selecter').val() : "") + "}\r\n" +
        "OPEN_BAGS = " + $('#open-bag-checkbox').is(":checked") + "\r\n" +
        "AUTO_DELETE = {" + $('#auto-delete-field').val() + "}\r\n\r\n" +
        "MAX_MONSTERS = " + $('#max-monster').val() + "\r\n" +
        "MIN_MONSTERS = " + $('#min-monster').val() + "\r\n\r\n" +
        "FORBIDDEN_MONSTERS = {" + $('#forbidden-ennemy-field').val() + "}\r\n" +
        "FORCE_MONSTERS = {" + $('#mendatory-ennemy-field').val() + "}\r\n\r\n" +
        "" +
        "function hiboux()\r\n" +
        "\tnpc:npc(522,3)\r\n" +
        "\tnpc:reply(-1)\r\n" +
        "\texchange:putAllItems()\r\n" +
        "\tglobal:leaveDialog()\r\n" +
        "end\r\n\r\n";
    if (pathLinearData.length !== 0) {
        txt +=
            'function GatherFight()\r\n' +
            '\tfor index, actualMap in pairs(mapsWithChangeMap) do\r\n' +
            '\t\tif (map:onMap(actualMap.map)) then\r\n' +
            '\t\t\tif actualMap.gather and actualMap.fight then\r\n' +
            '\t\t\t\treturn "both"\r\n' +
            '\t\t\telseif actualMap.gather then\r\n' +
            '\t\t\t\treturn "gather"\r\n' +
            '\t\t\telseif actualMap.forcegather then\r\n' +
            '\t\t\t\treturn "forcegather"\r\n' +
            '\t\t\telseif actualMap.fight then\r\n' +
            '\t\t\t\treturn "fight"\r\n' +
            '\t\t\telseif actualMap.forcefight then\r\n' +
            '\t\t\t\treturn "forcefight"\r\n' +
            '\t\t\tend\r\n' +
            '\t\t\treturn "path"\r\n' +
            '\t\tend\r\n' +
            '\tend\r\n' +
            '\treturn false\r\n' +
            'end\r\n' +
            '\r\n' +
            '------------------\r\n' +
            '\r\n' +
            'function move()\r\n';
        if (havenbagCheck('move')) {
            txt += "\tif map:onMap(\"0,0\") then\r\n";
            firstIf = false;
            for (let index = 0; index < havenBagData.length; index++) {
                if (havenBagData[index].move) {
                    if (!firstIf) {
                        txt += "\t\tif actualMap == \"" + havenBagData[index].map + "\" then\r\n\t\t\tmap:changeMap(\"zaap(" + havenBagData[index].mapidToGo + ")\")\r\n";
                        firstIf = true;
                    } else
                        txt += "\t\telseif actualMap == \"" + havenBagData[index].map + "\" then\r\n\t\t\tmap:changeMap(\"zaap(" + havenBagData[index].mapidToGo + ")\")\r\n";
                }
            }
            txt += '\t\tend\r\n' +
                '\telse\r\n' +
                '\t\tactualMap = map:currentMap()\r\n' +
                '\tend\r\n';
        }
        txt +=
            '\tif banque then\r\n' +
            '\t\tfor index, actualMap in pairs(mapsWithChangeMap) do\r\n' +
            '\t\t\tif actualMap.doNextMap then\r\n' +
            '\t\t\t\tactualMap.doNextMap = "no"\r\n' +
            '\t\t\tend\r\n' +
            '\t\t\tif actualMap.doThirdMap then\r\n' +
            '\t\t\t\tactualMap.doThirdMap = "no"\r\n' +
            '\t\t\tend\r\n' +
            '\t\t\tif actualMap.doFourthdMap then\r\n' +
            '\t\t\t\tactualMap.doFourthMap = "no"\r\n' +
            '\t\t\tend\r\n' +
            '\t\tend\r\n' +
            '\t\tbanque = false\r\n' +
            '\tend\r\n' +
            '\tif GatherFight() == "both" then\r\n' +
            '\t\treturn {\r\n' +
            '\t\t\t{map = map:currentMap(), custom = processMap, gather = true, fight = true}\r\n' +
            '\t\t}\r\n' +
            '\telseif GatherFight() == "gather" then\r\n' +
            '\t\treturn {\r\n' +
            '\t\t\t{map = map:currentMap(), custom = processMap, gather = true}\r\n' +
            '\t\t}\r\n' +
            '\telseif GatherFight() == "forcegather" then\r\n' +
            '\t\treturn {\r\n' +
            '\t\t\t{map = map:currentMap(), custom = processMap, forcegather = true}\r\n' +
            '\t\t}\r\n' +
            '\telseif GatherFight() == "fight" then\r\n' +
            '\t\treturn {\r\n' +
            '\t\t\t{map = map:currentMap(), custom = processMap, fight = true}\r\n' +
            '\t\t}\r\n' +
            '\telseif GatherFight() == "forcefight" then\r\n' +
            '\t\treturn {\r\n' +
            '\t\t\t{map = map:currentMap(), custom = processMap, forcefight = true}\r\n' +
            '\t\t}\r\n' +
            '\telseif GatherFight() == "path" then\r\n' +
            '\t\treturn {\r\n' +
            '\t\t\t{map = map:currentMap(), custom = processMap}\r\n' +
            '\t\t}\r\n' +
            '\telse\r\n' +
            '\t\tglobal:printError("Aucune action sur la map : " .. map:currentMap() .. " | mapID : " .. map:currentMapId())\r\n' +
            '\t\tglobal:disconnect()\r\n' +
            '\tend\r\n' +
            'end\r\n' +
            '\r\n' +
            'mapsWithChangeMap = {\r\n';
        for (let key in pathLinearData) {
            txt += '\t{map = "' + pathLinearData[key].map.replace(' ', '') + '", changeMap = "' + getLinearAction(1, key) + '"' + (pathLinearData[key].index >= 2 ? ', nextMap = "' + getLinearAction(2, key) + '", doNextMap = "no"' : "") + (pathLinearData[key].index >= 3 ? ', thirdMap = "' + getLinearAction(3, key) + '", doThirdMap = "no"' : "") + (pathLinearData[key].index >= 4 ? ', fourthMap = "' + getLinearAction(4, key) + '", doFourthMap = "no"' : "") + gatherFigh(key, pathLinearData) + '},\r\n';
        }
        for (let key in pathData) {
            txt += '\t{map = "' + pathData[key].map.replace(" ", "") + '", changeMap = "' + pathGenerator(key, pathData) + '"' + gatherFigh(key, pathData) + '},\r\n';
        }
        txt += '}\r\n' +
            '\r\n' +
            'function processMap()\r\n' +
            '\tfor index, actualMap in pairs(mapsWithChangeMap) do\r\n' +
            '\t\tif (map:onMap(actualMap.map)) then\r\n' +
            '\t\t\tif (actualMap.doNextMap) and (actualMap.doThirdMap) and (actualMap.doFourthMap) then\r\n' +
            '\t\t\t\tif (actualMap.doFourthMap) == "yes" then\r\n' +
            '\t\t\t\t\tactualMap.doFourthMap = "no"\r\n' +
            '\t\t\t\t\tif (actualMap.fourthMapDoor) then\r\n' +
            '\t\t\t\t\t\tactualMap.fourthMapDoor = tonumber(actualMap.fourthMapDoor)\r\n' +
            '\t\t\t\t\t\tmap:door(actualMap.fourthMapDoor)\r\n' +
            '\t\t\t\t\telseif (actualMap.fourthMapCustom) then\r\n' +
            '\t\t\t\t\t\treturn (actualMap.fourthMapCustom)()\r\n' +
            '\t\t\t\t\telse\r\n' +
            '\t\t\t\t\t\tmap:changeMap(actualMap.fourthMap)\r\n' +
            '\t\t\t\t\tend\r\n' +
            '\t\t\t\telseif (actualMap.doThirdMap) == "yes" then\r\n' +
            '\t\t\t\t\tactualMap.doThirdMap = "no"\r\n' +
            '\t\t\t\t\tactualMap.doFourthMap = "yes"\r\n' +
            '\t\t\t\t\tif (actualMap.thirdMapDoor) then\r\n' +
            '\t\t\t\t\t\tactualMap.thirdMapDoor = tonumber(actualMap.thirdMapDoor)\r\n' +
            '\t\t\t\t\t\tmap:door(actualMap.thirdMapDoor)\r\n' +
            '\t\t\t\t\telseif (actualMap.thirdMapCustom) then\r\n' +
            '\t\t\t\t\t\treturn (actualMap.thirdMapCustom)()\r\n' +
            '\t\t\t\t\telse\r\n' +
            '\t\t\t\t\t\tmap:changeMap(actualMap.thirdMap)\r\n' +
            '\t\t\t\t\tend\r\n' +
            '\t\t\t\telseif (actualMap.doNextMap == "yes") then\r\n' +
            '\t\t\t\t\tactualMap.doNextMap = "no"\r\n' +
            '\t\t\t\t\tactualMap.doThirdMap = "yes"\r\n' +
            '\t\t\t\t\tif (actualMap.nextMapDoor) then\r\n' +
            '\t\t\t\t\t\tactualMap.nextMapDoor = tonumber(actualMap.nextMapDoor)\r\n' +
            '\t\t\t\t\t\tmap:door(actualMap.nextMapDoor)\r\n' +
            '\t\t\t\t\telseif (actualMap.nextMapCustom) then\r\n' +
            '\t\t\t\t\t\treturn (actualMap.nextMapCustom)()\r\n' +
            '\t\t\t\t\telse\r\n' +
            '\t\t\t\t\t\tmap:changeMap(actualMap.nextMap)\r\n' +
            '\t\t\t\t\tend\r\n' +
            '\t\t\t\telseif (actualMap.changeMapDoor) then\r\n' +
            '\t\t\t\t\tactualMap.doNextMap = "yes"\r\n' +
            '\t\t\t\t\tactualMap.changeMapDoor = tonumber(actualMap.changeMapDoor)\r\n' +
            '\t\t\t\t\tmap:door(actualMap.changeMapDoor)\r\n' +
            '\t\t\t\telseif (actualMap.changeMapCustom) then\r\n' +
            '\t\t\t\t\tactualMap.doNextMap = "yes"\r\n' +
            '\t\t\t\t\treturn (actualMap.changeMapCustom)()\r\n' +
            '\t\t\t\telseif (actualMap.changeMap) then\r\n' +
            '\t\t\t\t\tactualMap.doNextMap = "yes"\r\n' +
            '\t\t\t\t\tmap:changeMap(actualMap.changeMap)\r\n' +
            '\t\t\t\tend\r\n' +
            '\t\t\telseif (actualMap.doNextMap) and (actualMap.doThirdMap) then\r\n' +
            '\t\t\t\tif (actualMap.doThirdMap) == "yes" then\r\n' +
            '\t\t\t\t\tactualMap.doThirdMap = "no"\r\n' +
            '\t\t\t\t\tif (actualMap.thirdMapDoor) then\r\n' +
            '\t\t\t\t\t\tactualMap.thirdMapDoor = tonumber(actualMap.thirdMapDoor)\r\n' +
            '\t\t\t\t\t\tmap:door(actualMap.thirdMapDoor)\r\n' +
            '\t\t\t\t\telseif (actualMap.thirdMapCustom) then\r\n' +
            '\t\t\t\t\t\treturn (actualMap.thirdMapCustom)()\r\n' +
            '\t\t\t\t\telse\r\n' +
            '\t\t\t\t\t\tmap:changeMap(actualMap.thirdMap)\r\n' +
            '\t\t\t\t\tend\r\n' +
            '\t\t\t\telseif (actualMap.doNextMap == "yes") then\r\n' +
            '\t\t\t\t\tactualMap.doNextMap = "no"\r\n' +
            '\t\t\t\t\tactualMap.doThirdMap = "yes"\r\n' +
            '\t\t\t\t\tif (actualMap.nextMapDoor) then\r\n' +
            '\t\t\t\t\t\tactualMap.nextMapDoor = tonumber(actualMap.nextMapDoor)\r\n' +
            '\t\t\t\t\t\tmap:door(actualMap.nextMapDoor)\r\n' +
            '\t\t\t\t\telseif (actualMap.nextMapCustom) then\r\n' +
            '\t\t\t\t\t\treturn (actualMap.nextMapCustom)()\r\n' +
            '\t\t\t\t\telse\r\n' +
            '\t\t\t\t\t\tmap:changeMap(actualMap.nextMap)\r\n' +
            '\t\t\t\t\tend\r\n' +
            '\t\t\t\telseif (actualMap.changeMapDoor) then\r\n' +
            '\t\t\t\t\tactualMap.doNextMap = "yes"\r\n' +
            '\t\t\t\t\tactualMap.changeMapDoor = tonumber(actualMap.changeMapDoor)\r\n' +
            '\t\t\t\t\tmap:door(actualMap.changeMapDoor)\r\n' +
            '\t\t\t\telseif (actualMap.changeMapCustom) then\r\n' +
            '\t\t\t\t\tactualMap.doNextMap = "yes"\r\n' +
            '\t\t\t\t\treturn (actualMap.changeMapCustom)()\r\n' +
            '\t\t\t\telseif (actualMap.changeMap) then\r\n' +
            '\t\t\t\t\tactualMap.doNextMap = "yes"\r\n' +
            '\t\t\t\t\tmap:changeMap(actualMap.changeMap)\r\n' +
            '\t\t\t\tend\r\n' +
            '\t\t\telseif (actualMap.doNextMap) then\r\n' +
            '\t\t\t\tif (actualMap.doNextMap == "yes") then\r\n' +
            '\t\t\t\t\tactualMap.doNextMap = "no"\r\n' +
            '\t\t\t\t\tif (actualMap.nextMapDoor) then\r\n' +
            '\t\t\t\t\t\tactualMap.nextMapDoor = tonumber(actualMap.nextMapDoor)\r\n' +
            '\t\t\t\t\t\tmap:door(actualMap.nextMapDoor)\r\n' +
            '\t\t\t\t\telseif (actualMap.nextMapCustom) then\r\n' +
            '\t\t\t\t\t\treturn (actualMap.nextMapCustom)()\r\n' +
            '\t\t\t\t\telse\r\n' +
            '\t\t\t\t\t\tmap:changeMap(actualMap.nextMap)\r\n' +
            '\t\t\t\t\tend\r\n' +
            '\t\t\t\telseif (actualMap.changeMapDoor) then\r\n' +
            '\t\t\t\t\tactualMap.doNextMap = "yes"\r\n' +
            '\t\t\t\t\tactualMap.changeMapDoor = tonumber(actualMap.changeMapDoor)\r\n' +
            '\t\t\t\t\tmap:door(actualMap.changeMapDoor)\r\n' +
            '\t\t\t\telseif (actualMap.changeMapCustom) then\r\n' +
            '\t\t\t\t\tactualMap.doNextMap = "yes"\r\n' +
            '\t\t\t\t\treturn (actualMap.changeMapCustom)()\r\n' +
            '\t\t\t\telseif (actualMap.changeMap) then\r\n' +
            '\t\t\t\t\tactualMap.doNextMap = "yes"\r\n' +
            '\t\t\t\t\tmap:changeMap(actualMap.changeMap)\r\n' +
            '\t\t\t\tend\r\n' +
            '\t\t\telseif (actualMap.changeMapDoor) then\r\n' +
            '\t\t\t\tactualMap.changeMapDoor = tonumber(actualMap.changeMapDoor)\r\n' +
            '\t\t\t\tmap:door(actualMap.changeMapDoor)\r\n' +
            '\t\t\telseif (actualMap.changeMapCustom) then\r\n' +
            '\t\t\t\treturn (actualMap.changeMapCustom)()\r\n' +
            '\t\t\telseif (actualMap.changeMap) then\r\n' +
            '\t\t\t\tmap:changeMap(actualMap.changeMap)\r\n' +
            '\t\t\telseif (actualMap.forcegather) then\r\n' +
            '\t\t\tend\r\n' +
            '\t\tend\r\n' +
            '\tend\r\n' +
            'end\r\n\r\n';
    } else {
        txt += "\r\nfunction move()\r\n";
        if (havenbagCheck('move')) {
            txt += "\tif map:onMap(\"0,0\") then\r\n";
            firstIf = false;
            for (let index = 0; index < havenBagData.length; index++) {
                if (havenBagData[index].move) {
                    if (!firstIf) {
                        txt += "\t\tif actualMap == \"" + havenBagData[index].map + "\" then\r\n\t\t\tmap:changeMap(\"zaap(" + havenBagData[index].mapidToGo + ")\")\r\n";
                        firstIf = true;
                    } else
                        txt += "\t\telseif actualMap == \"" + havenBagData[index].map + "\" then\r\n\t\t\tmap:changeMap(\"zaap(" + havenBagData[index].mapidToGo + ")\")\r\n";
                }
            }
            txt += '\t\tend\r\n' +
                '\telse\r\n' +
                '\t\tactualMap = map:currentMap()\r\n' +
                '\tend\r\n';
        }
        txt += '\treturn {\r\n' +
            '\t\t{map = "192415750", path = "409"}, --Interieur banque Astrub vers Sortie--\r\n' +
            '\t\t{map = "54534165", path = "424"}, --Interieur banque Frigost vers Sortie--\r\n' +
            '\t\t{map = "2885641", path = "424"}, --Interieur banque Bonta vers Sortie--\r\n' +
            '\t\t{map = "99095051", path = "410"}, --Interieur banque Amakna vers Sortie--\r\n' +
            '\t\t{map = "8912911", path = "424"}, --Interieur banque Brakmar vers Sortie--\r\n' +
            '\t\t{map = "91753985", path = "396"}, --Interieur banque Sufokia vers Sortie--\r\n' +
            '\t\t{map = "86511105", door = "452"}, --Interieur banque Ottomaï vers Sortie--\r\n' +
            '\t\t{map = "8129542", path = "409"}, --Interieur banque Pandala vers Sortie--\r\n' +
            '\t\t{map = "84935175", path = "425"}, --Interieur banque Montagne Koalak vers Sortie--\r\n';
        for (let key in pathData) {
            txt += '\t\t{map = "' + pathData[key].map.replace(" ", "") + '", path = "' + pathGenerator(key, pathData) + '"' + gatherFigh(key, pathData) + '},\r\n';
        }
        txt += '\t}\r\nend\r\n\r\n';
    }
    txt += "function bank()\r\n";
    if (pathLinearData.length !== 0) {
        txt += '\tbanque = true\r\n';
    }
    if (havenbagCheck('bank')) {
        txt += "\tif map:onMap(\"0,0\") then\r\n";
        firstIf = false;
        for (let index = 0; index < havenBagData.length; index++) {
            if (havenBagData[index].bank) {
                if (!firstIf) {
                    txt += "\t\tif actualMap == \"" + havenBagData[index].map + "\" then\r\n\t\t\tmap:changeMap(\"zaap(" + havenBagData[index].mapidToGo + ")\")\r\n";
                    firstIf = true;
                } else
                    txt += "\t\telseif actualMap == \"" + havenBagData[index].map + "\" then\r\n\t\t\tmap:changeMap(\"zaap(" + havenBagData[index].mapidToGo + ")\")\r\n";
            }
        }
        txt += "\t\tend\r\n" +
            "\telse\r\n" +
            "\t\tactualMap = map:currentMap()\r\n" +
            "\tend\r\n";
    }
    txt += "\treturn {\r\n";
    for (let key in bankData) {
        txt += '\t\t{map = "' + bankData[key].map.replace(" ", "") + '", path = "' + pathGenerator(key, bankData) + '"},\r\n';
    }
    txt += '\t\t{map = "191104002", door = "288"}, --Devant banque Astrub--\r\n' +
        '\t\t{map = "192415750", path = "396", custom = hiboux}, --Banque Astrub--\r\n' +
        '\t\t{map = "54172457", door = "358"}, --Devant banque Frigost--\r\n' +
        '\t\t{map = "54534165", path = "424", npcBank = true}, --Banque Frigost--\r\n' +
        '\t\t{map = "147254", door = "383"}, --Devant banque Bonta--\r\n' +
        '\t\t{map = "2885641", path = "424", npcBank = true}, --Banque Bonta--\r\n' +
        '\t\t{map = "88081177", door = "216"}, --Devant banque Amakna--\r\n' +
        '\t\t{map = "99095051", path = "410", npcBank = true}, --Banque Amakna--\r\n' +
        '\t\t{map = "144931", door = "248"}, --Devant banque Brakmar--\r\n' +
        '\t\t{map = "8912911", path = "424", npcBank = true}, --Banque Brakmar--\r\n' +
        '\t\t{map = "90703872", door = "302"}, --Devant banque Sufokia --\r\n' +
        '\t\t{map = "91753985", path = "494", npcBank = true}, --Banque Sufokia--\r\n' +
        '\t\t{map = "155157", door = "355"}, --Devant banque Ottomaï--\r\n' +
        '\t\t{map = "86511105", door = "452", npcBank = true}, --Banque Ottomaï--\r\n' +
        '\t\t{map = "12580", door = "284"}, --Devant banque Pandala--\r\n' +
        '\t\t{map = "8129542", path = "409", npcBank = true}, --Banque Pandala--\r\n' +
        '\t\t{map = "73400323", door = "330"}, --Devant banque Montagne Koalak--\r\n' +
        '\t\t{map = "84935175", path = "425", npcBank = true}, --Banque Montagne Koalak--\r\n\t}\r\nend\r\n' +
        '\r\n\r\nfunction phenix()\r\n';
    if (havenbagCheck('phenix')) {
        txt += "\tif map:onMap(\"0,0\") then\r\n";
        firstIf = false;
        for (let index = 0; index < havenBagData.length; index++) {
            if (havenBagData[index].phenix) {
                if (!firstIf) {
                    txt += '\t\tif actualMap == \"' + havenBagData[index].map + '\" then\r\n\t\t\tmap:changeMap(\"zaap(' + havenBagData[index].mapidToGo + ')\")\r\n';
                    firstIf = true;
                } else
                    txt += '\t\telseif actualMap == \"' + havenBagData[index].map + '\" then\r\n\t\t\tmap:changeMap(\"zaap(' + havenBagData[index].mapidToGo + ')\")\r\n';
            }
        }
        txt += '\t\tend\r\n' +
            '\telse\r\n' +
            '\t\tactualMap = map:currentMap()\r\n' +
            '\tend\r\n';
    } else if (havenbagCheck('move')) txt += '\tactualMap = map:currentMap()\r\n';
    txt += "\treturn {\r\n";
    for (let key in phenixData) {
        if (checkPhenixPos(phenixData[key].map.replace(" ", ""))[0]) {
            txt += '\t\t{map = "' + phenixPos[checkPhenixPos(phenixData[key].map.replace(" ", ""))[1]].map + '", phenix = "' + phenixPos[checkPhenixPos(phenixData[key].map.replace(" ", ""))[1]].cellid + '", path = "' + pathGenerator(key, phenixData) + '"},\r\n';
        } else {
            txt += '\t\t{map = "' + phenixData[key].map.replace(" ", "") + '", path = "' + pathGenerator(key, phenixData) + '"},\r\n';
        }
    }
    txt += '\t}\r\nend\r\n';
    saveTextAsFile(txt);
});

function saveTextAsFile(txt) {
    var textToSaveAsBlob = new Blob([txt], {
        type: "text/plain"
    });
    var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);
    var fileNameToSaveAs = '[' + ($('#type-field').val() ? $('#type-field').val() : "") + '][' + $('#area-field').val() + ']' + $('#file-name-field').val() + '.lua';
    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    downloadLink.href = textToSaveAsURL;
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
}

function languageSelector(params) {
    switch (params) {
        case "fr":
            $('#path-creator-bar').empty().append('<div class="leaflet-bar leaflet-control path-selecter"> <a class="leaflet-control-zoom-in fas fa-arrow-up" href="#" title="Haut" style="color:black;"></a> <a class="leaflet-control-zoom-in fas fa-arrow-down" href="#" title="Bas" style="color:black;"></a> <a class="leaflet-control-zoom-in fas fa-arrow-left" href="#" title="Gauche" style="color:black;"></a> <a class="leaflet-control-zoom-in fas fa-arrow-right" href="#" title="Droite" style="color:black;"></a> <a class="leaflet-control-zoom-in fas fa-suitcase" href="#" title="Havre-sac" style="color:black;"></a> </div><div class="leaflet-bar leaflet-control tool-selecter"> <a class="leaflet-control-zoom-in fas fa-eraser" href="#" title="Effacer une action" style="color:black;"></a> <a class="leaflet-control-zoom-in fas fa-random" href="#" title="Linéaire" style="color:black;"></a> </div><div class="leaflet-bar leaflet-control path-type-selecter"> <a class="leaflet-control-zoom-in fas fa-arrows-alt toggled" href="#" title="Deplacement" style="color:black;"></a> <a class="leaflet-control-zoom-in fas fa-shield-alt" href="#" title="Combat" style="color:#d82121;"></a> <a class="leaflet-control-zoom-in fas fa-leaf" href="#" title="Récolte" style="color:#229e22;"></a> <a class="leaflet-control-zoom-in fas fa-university" href="#" title="Banque" style="color:#3a3ab9;"></a> <a class="leaflet-control-zoom-in fas fa-fire" href="#" title="Phenix" style="color:purple;"></a> </div><div class="leaflet-bar leaflet-control path-setting"> <a class="leaflet-control-zoom-in fas fa-info-circle" href="#" title="Paramétre du trajet" style="color:#3a3ab9;"></a> <a class="leaflet-control-zoom-in fas fa-save" href="#" title="Sauvegarder" style="color:#3a3ab9;"></a> <input type="file" id="file" title="Ouvrir" style="display: none;"> <a class="leaflet-control-zoom-in fas fa-folder-open" href="#" title="Ouvrir" style="color:#ffd228;"></a> <a class="leaflet-control-zoom-in fas fa-trash-alt" href="#" title="Supprimer tout" style="color:#4c4c4c;"></a> <a class="leaflet-control-zoom-in fas fa-cog" href="#" title="Paramétre" style="color:#4c4c4c;"></a> </div>');
            $('#havenBagSetting').empty().append('<div class="modal-dialog" role="document"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button> <h4 class="modal-title" id="myModalLabel">Zaap : </h4> </div><div class="modal-body"> <label>Zaap d\'arrivée :</label> <select class="form-control" id="sel1"> <option value=\'{"map": "4,-19", "mapid": "84674563"}\'>Astrub | 4,-19</option> <option value=\'{"map": "-32,-56", "mapid": "147768"}\'>Bonta | -32,-56</option> <option value=\'{"map": "-26,35", "mapid": "144419"}\'>Brâkmar | -26,35</option> <option value=\'{"map": "-1,13", "mapid": "88212746"}\'>Amakna (Bord de la forêt maléfique) | -1,13</option> <option value=\'{"map": "3,-5", "mapid": "68552706"}\'>Amakna (Château d\'Amakna) | 3,-5</option> <option value=\'{"map": "5,7", "mapid": "88082704"}\'>Amakna (Coins des Bouftous) | 5,7</option> <option value=\'{"map": "7,-4", "mapid": "68419587"}\'>Amakna (Port de Madrestam) | 7,-4</option> <option value=\'{"map": "-2,0", "mapid": "88213271"}\'>Amakna (Village d\'Amakna) | -2,0</option> <option value=\'{"map": "-1,24", "mapid": "88212481"}\'>Amakna (Plaîne des Scarafeuilles) | -1,24</option> <option value=\'{"map": "10,22", "mapid": "88085249"}\'>Baie de Sufokia (Rivage Sufokien) | 10,22</option> <option value=\'{"map": "13,26", "mapid": "95422468"}\'>Baie de Sufokia (Sufokia) | 13,26</option> <option value=\'{"map": "-46,18", "mapid": "154642"}\'>Île d\'Otomaïl (Village côtier) | -46,18</option> <option value=\'{"map": "-79,-41", "mapid": "54172969"}\'>Île de Frigost (La Bourgade) | -79,-41</option> <option value=\'{"map": "-77,-73", "mapid": "54172489"}\'>Île de Frigost (Village enseveli) | -77,-73</option> <option value=\'{"map": "35,12", "mapid": "156762120"}\'>Île de Moon (Plage de la Tortue) | 35,12</option> <option value=\'{"map": "-16,1", "mapid": "73400320"}\'>Montagne des Koalaks (Village des Eleveurs) | -16,1</option> <option value=\'{"map": "26,-37", "mapid": "13605"}\'>Pandala Neutre (Faubourgs de Pandala) | 26,-37</option> <option value=\'{"map": "29,-49", "mapid": "15153"}\'>Pandala Feu (Village de Feudala) | 29,-49</option> <option value=\'{"map": "-27,-36", "mapid": "142087694"}\'>Plaine de Cania (Champs de Cania) | -27,-36</option> <option value=\'{"map": "-3,-42", "mapid": "156240386"}\'>Plaine de Cania (Lac de Cania) | -3,-42</option> <option value=\'{"map": "-13,-28", "mapid": "165152263"}\'>Plaine de Cania (Massif de Cania) | -13,-28</option> <option value=\'{"map": "-5,-23", "mapid": "84806401"}\'>Plaine de Cania (Plaine des Porkass) | -5,-23</option> <option value=\'{"map": "-17,-47", "mapid": "147590153"}\'>Plaine de Cania (Plaines Rocheuses) | -17,-47</option> <option value=\'{"map": "-20,-20", "mapid": "164364304"}\'>Plaine de Cania (Route Rocailleuse) | -20,-20</option> <option value=\'{"map": "15,-58", "mapid": "173278210"}\'>Saharach (Dunes des ossements) | 15,-58</option> <option value=\'{"map": "-25,12", "mapid": "171967506"}\'>Landes de Sidimote (Route des Roulottes) | -25,12</option> </select> </div><div class="modal-footer"> <button type="button" class="btn btn-secondary" data-dismiss="modal">Fermer</button> <button type="button" class="btn btn-primary">Valider</button> </div></div></div>');
            $('#pathSetting').empty().append('<div class="modal-dialog" role="document"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">×</span> </button> <h4 class="modal-title" id="myModalLabel">Paramétre du trajet</h4> </div><div class="modal-body"> <div role="tabpanel"> <ul class="nav nav-tabs" role="tablist"> <li role="presentation" class="active"> <a href="#informationTab" aria-controls="informationTab" role="tab" data-toggle="tab">Information</a> </li><li role="presentation"> <a href="#fightTab" aria-controls="fightTab" role="tab" data-toggle="tab">Combat</a> </li><li role="presentation"> <a href="#gatherTab" aria-controls="gatherTab" role="tab" data-toggle="tab">Récolte</a> </li><li role="presentation"> <a href="#bankTab" aria-controls="bankTab" role="tab" data-toggle="tab">Banque</a> </li></ul> <div class="tab-content"> <div role="tabpanel" class="tab-pane active" id="informationTab"> <br/> <div class="row no-gutters"> <div class="col col-sm-2"> <p>Nom :</p></div><div class="col col-sm-10"> <input type="text" class="form-control" id="file-name-field"> </div><p></p></div><div class="row no-gutters"> <div class="col col-sm-2"> <p>Zone :</p></div><div class="col col-sm-10"> <input type="text" class="form-control" placeholder="Astrub" id="area-field"> </div></div><div class="row no-gutters"> <div class="col col-sm-2"> <p>Type :</p></div><div class="col col-sm-10"> <select class="form-control" id="type-field"> <option disabled selected value></option> <option>Combat</option> <option>Déplacement</option> <option>Récolte</option> </select> </div><p></p></div><div class="row no-gutters"> <div class="col col-sm-2"> <p>Version :</p></div><div class="col col-sm-10"> <input type="number" value="1.0" step="0.1" class="form-control" id="version-field"> </div></div><div class="row no-gutters"> <div class="col col-sm-2"> <p>Auteur :</p></div><div class="col col-sm-10"> <input type="text" class="form-control" placeholder="Drigtime" id="author-field"> </div></div><br></div><div role="tabpanel" class="tab-pane" id="fightTab"> <br/> <div class="row"> <div class="col col-sm-5"> <p>Nombre de monstres minimum : </p></div><div class="col col-sm-7"> <input type="number" max="8" min="1" value="1" id="min-monster" class="=" form-control> </div></div><div class="row"> <div class="col col-sm-5"> <p>Nombre de monstres maximum : </p></div><div class="col col-sm-7"> <input type="number" max="8" min="1" value="8" id="max-monster" class="=" form-control> </div></div><br/> <div class="row panel panel-default" style="margin-left: 0; margin-right: 0"> <div class="panel-heading">Monstres interdit</div><div class="panel-body"> <div class="col col-sm-5"> <p>Liste des monstres à éviter : </p></div><div class="col col-sm-6"> <input type="text" class="form-control" placeholder="ex : 101, 98 ..." id="forbidden-ennemy-field"> </div><div class="col col-sm-1"><a target="_blank" href="https://snowbot.eu/monstres.txt" class="fas fa-info-circle" style="font-size: 32px; text-decoration: none"></a></div></div></div><div class="row panel panel-default" style="margin-left: 0; margin-right: 0"> <div class="panel-heading">Monstres obligatoire</div><div class="panel-body"> <div class="col col-sm-5"> <p>Liste des monstres à avoir : </p></div><div class="col col\-sm\-6"><input type="text" class="form\-control" placeholder="ex : 101, 98 \.\.\." id="mendatory-ennemy-field"></div><div class="col col-sm-1"><a target="_blank" href="https://snowbot.eu/monstres.txt" class="fas fa-info-circle" style="font-size: 32px; text-decoration: none"></a></div></div></div></div><div role="tabpanel" class="tab-pane" id="gatherTab"> <br/> <div class="checkbox checbox-switch switch-primary"> <label> <input type="checkbox" id="open-bag-checkbox" checked=""/> <span></span> Ouverture automatique des sacs de ressources </label> </div><div class="panel panel-default" style="margin-left: 0; margin-right: 0"> <div class="panel-heading">Ressources à récolter</div><div class="panel-body" id="ressources-to-gather"> <div class="row"> <div class="col col-sm-5"> <p>Liste des ressources à récolter : </p></div><div class="col col-sm-7"> <select class="form-control selectpicker" data-live-search="true" multiple data-dropup-auto="false" id="ressources-selecter"> </select> </div></div><div class="ressources-selected-summary"></div></div></div></div><div role="tabpanel" class="tab-pane" id="bankTab"> <br/><div class="row panel panel-default" style="margin-left: 0; margin-right: 0"> <div class="panel-heading">Objets à supprimer automatiquement</div><div class="panel-body"> <div class="col col-sm-5"> <p>Liste des objets à supprimer automatiquement : </p></div><div class="col col\-sm\-6"><input type="text" class="form\-control" placeholder="ex : 101, 98 \.\.\." id="auto-delete-field"></div><div class="col col-sm-1"><a target="_blank" href="https://snowbot.eu/objets.txt" class="fas fa-info-circle" style="font-size: 32px; text-decoration: none"></a></div></div></div></div></div></div><div class="modal-footer"> <button type="button" class="btn btn-primary" data-dismiss="modal">Valider</button> </div></div></div></div></div>');
            // $('#setting').empty().append('<div class="modal-dialog" role="document"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">×</span> </button> <h4 class="modal-title" id="myModalLabel">Paramétre</h4> </div><div class="modal-body"> <div role="tabpanel"> <ul class="nav nav-tabs" role="tablist"> <li role="presentation"> <a href="#shortcutTab" aria-controls="shortcutTab" role="tab" data-toggle="tab">Raccourcis</a> </li><li role="presentation" class="active"> <a href="#languageTab" aria-controls="languageTab" role="tab" data-toggle="tab">Langue</a> </li></ul> <div class="tab-content"> <div role="tabpanel" class="tab-pane" id="shortcutTab"> <br/> <table class="table table-bordered table-hover table-condensed table-responsive"> <thead> <tr> <th> Nom de l\'action </th> <th> Raccourci </th> </tr></thead> <tbody> <tr> <td> Haut </td><td> <input type="text" class="form\-control" id="shortcut-key-up" value="' + GM_getValue("shortcut-key-up", "z") + '" readonly> </td></tr><tr> <td> Bas </td><td> <input type="text" class="form\-control" id="shortcut-key-down" value="' + GM_getValue("shortcut-key-down", "s") + '" readonly> </td></tr><tr> <td> Gauche </td><td> <input type="text" class="form\-control" id="shortcut-key-left" value="' + GM_getValue("shortcut-key-left", "q") + '" readonly> </td></tr><tr> <td> Droite </td><td> <input type="text" class="form\-control" id ="shortcut-key-right" value="' + GM_getValue("shortcut-key-right", "d") + '" readonly> </td></tr><tr> <td> Havre-sac </td><td> <input type="text" class="form\-control" id="shortcut-key-havenbag" value="' + GM_getValue("shortcut-key-havenbag", "a") + '" readonly> </td></tr><tr> <td> Effacer une action </td><td> <input type="text" class="form\-control" id="shortcut-key-erase" value="' + GM_getValue("shortcut-key-erase", "e") + '" readonly> </td></tr></tbody> </table> </div><div role="tabpanel" class="tab-pane active" id="languageTab"> <br/> <div class="row panel panel-default" style="margin-left: 0; margin-right: 0"> <div class="panel-heading">Langue</div><div class="panel-body"> <select multiple class="form-control" id="language-selected"> <option value="fr">Français</option> <option value="en">English</option> <option value="es">Español</option> </select> </div></div></div><div class="modal-footer"> <button type="button" class="btn btn-primary" data-dismiss="modal">Valider</button> </div></div></div></div></div></div>');
            $('#ressources-selecter').empty();
            break;
        // case "en":
        //     $('#path-creator-bar').empty().append('<div class="leaflet-bar leaflet-control path-selecter"> <a class="leaflet-control-zoom-in fas fa-arrow-up" href="#" title="Top" style="color:black;"></a> <a class="leaflet-control-zoom-in fas fa-arrow-down" href="#" title="Bottom" style="color:black;"></a> <a class="leaflet-control-zoom-in fas fa-arrow-left" href="#" title="Left" style="color:black;"></a> <a class="leaflet-control-zoom-in fas fa-arrow-right" href="#" title="Right" style="color:black;"></a> <a class="leaflet-control-zoom-in fas fa-suitcase" href="#" title="Havenbag" style="color:black;"></a> </div><div class="leaflet-bar leaflet-control tool-selecter"> <a class="leaflet-control-zoom-in fas fa-eraser" href="#" title="Erase an action" style="color:black;"></a> <a class="leaflet-control-zoom-in fas fa-random" href="#" title="Linear" style="color:black;"></a> </div><div class="leaflet-bar leaflet-control path-type-selecter"> <a class="leaflet-control-zoom-in fas fa-arrows-alt toggled" href="#" title="Move" style="color:black;"></a> <a class="leaflet-control-zoom-in fas fa-shield-alt" href="#" title="Fight" style="color:#d82121;"></a> <a class="leaflet-control-zoom-in fas fa-leaf" href="#" title="Gather" style="color:#229e22;"></a> <a class="leaflet-control-zoom-in fas fa-university" href="#" title="Bank" style="color:#3a3ab9;"></a> <a class="leaflet-control-zoom-in fas fa-fire" href="#" title="Phoneix" style="color:purple;"></a> </div><div class="leaflet-bar leaflet-control path-setting"> <a class="leaflet-control-zoom-in fas fa-info-circle" href="#" title="Setting of the path" style="color:#3a3ab9;"></a> <a class="leaflet-control-zoom-in fas fa-save" href="#" title="Save" style="color:#3a3ab9;"></a> <input type="file" id="file" style="display: none;"> <a class="leaflet-control-zoom-in fas fa-folder-open" href="#" title="Open" style="color:#ffd228;"></a> <a class="leaflet-control-zoom-in fas fa-trash-alt" href="#" title="Erase all" style="color:#4c4c4c;"></a> <a class="leaflet-control-zoom-in fas fa-cog" href="#" title="Setting" style="color:#4c4c4c;"></a> </div>');
        //     $('#havenBagSetting').empty().append('<div class="modal-dialog" role="document"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button> <h4 class="modal-title" id="myModalLabel">Zaap : </h4> </div><div class="modal-body"> <label>Zaap to go :</label> <select class="form-control" id="sel1"> <option value=\'{"map": "4,-19", "mapid": "84674563"}\'>Astrub | 4,-19</option> <option value=\'{"map": "-32,-56", "mapid": "147768"}\'>Bonta | -32,-56</option> <option value=\'{"map": "-26,35", "mapid": "144419"}\'>Brâkmar | -26,35</option> <option value=\'{"map": "-1,13", "mapid": "88212746"}\'>Amakna (Bord de la forêt maléfique) | -1,13</option> <option value=\'{"map": "3,-5", "mapid": "68552706"}\'>Amakna (Château d\'Amakna) | 3,-5</option> <option value=\'{"map": "5,7", "mapid": "88082704"}\'>Amakna (Coins des Bouftous) | 5,7</option> <option value=\'{"map": "7,-4", "mapid": "68419587"}\'>Amakna (Port de Madrestam) | 7,-4</option> <option value=\'{"map": "-2,0", "mapid": "88213271"}\'>Amakna (Village d\'Amakna) | -2,0</option> <option value=\'{"map": "-1,24", "mapid": "88212481"}\'>Amakna (Plaîne des Scarafeuilles) | -1,24</option> <option value=\'{"map": "10,22", "mapid": "88085249"}\'>Baie de Sufokia (Rivage Sufokien) | 10,22</option> <option value=\'{"map": "13,26", "mapid": "95422468"}\'>Baie de Sufokia (Sufokia) | 13,26</option> <option value=\'{"map": "-46,18", "mapid": "154642"}\'>Île d\'Otomaïl (Village côtier) | -46,18</option> <option value=\'{"map": "-79,-41", "mapid": "54172969"}\'>Île de Frigost (La Bourgade) | -79,-41</option> <option value=\'{"map": "-77,-73", "mapid": "54172489"}\'>Île de Frigost (Village enseveli) | -77,-73</option> <option value=\'{"map": "35,12", "mapid": "156762120"}\'>Île de Moon (Plage de la Tortue) | 35,12</option> <option value=\'{"map": "-16,1", "mapid": "73400320"}\'>Montagne des Koalaks (Village des Eleveurs) | -16,1</option> <option value=\'{"map": "26,-37", "mapid": "13605"}\'>Pandala Neutre (Faubourgs de Pandala) | 26,-37</option> <option value=\'{"map": "29,-49", "mapid": "15153"}\'>Pandala Feu (Village de Feudala) | 29,-49</option> <option value=\'{"map": "-27,-36", "mapid": "142087694"}\'>Plaine de Cania (Champs de Cania) | -27,-36</option> <option value=\'{"map": "-3,-42", "mapid": "156240386"}\'>Plaine de Cania (Lac de Cania) | -3,-42</option> <option value=\'{"map": "-13,-28", "mapid": "165152263"}\'>Plaine de Cania (Massif de Cania) | -13,-28</option> <option value=\'{"map": "-5,-23", "mapid": "84806401"}\'>Plaine de Cania (Plaine des Porkass) | -5,-23</option> <option value=\'{"map": "-17,-47", "mapid": "147590153"}\'>Plaine de Cania (Plaines Rocheuses) | -17,-47</option> <option value=\'{"map": "-20,-20", "mapid": "164364304"}\'>Plaine de Cania (Route Rocailleuse) | -20,-20</option> <option value=\'{"map": "15,-58", "mapid": "173278210"}\'>Saharach (Dunes des ossements) | 15,-58</option> <option value=\'{"map": "-25,12", "mapid": "171967506"}\'>Landes de Sidimote (Route des Roulottes) | -25,12</option> </select> </div><div class="modal-footer"> <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button> <button type="button" class="btn btn-primary">Validate</button> </div></div></div>');
        //     $('#pathSetting').empty().append('<div class="modal-dialog" role="document"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">×</span> </button> <h4 class="modal-title" id="myModalLabel">Setting of the path</h4> </div><div class="modal-body"> <div role="tabpanel"> <ul class="nav nav-tabs" role="tablist"> <li role="presentation" class="active"> <a href="#informationTab" aria-controls="informationTab" role="tab" data-toggle="tab">Information</a> </li><li role="presentation"> <a href="#fightTab" aria-controls="fightTab" role="tab" data-toggle="tab">Fight</a> </li><li role="presentation"> <a href="#gatherTab" aria-controls="gatherTab" role="tab" data-toggle="tab">Gather</a> </li><li role="presentation"> <a href="#bankTab" aria-controls="bankTab" role="tab" data-toggle="tab">Bank</a> </li></ul> <div class="tab-content"> <div role="tabpanel" class="tab-pane active" id="informationTab"> <br/> <div class="row no-gutters"> <div class="col col-sm-2"> <p>Name :</p></div><div class="col col-sm-10"> <input type="text" class="form-control" id="file-name-field"> </div><p></p></div><div class="row no-gutters"> <div class="col col-sm-2"> <p>Area :</p></div><div class="col col-sm-10"> <input type="text" class="form-control" placeholder="Astrub" id="area-field"> </div></div><div class="row no-gutters"> <div class="col col-sm-2"> <p>Type :</p></div><div class="col col-sm-10"> <select class="form-control" id="type-field"> <option disabled selected value></option> <option>Fight</option> <option>Move</option> <option>Gather</option> </select> </div><p></p></div><div class="row no-gutters"> <div class="col col-sm-2"> <p>Version :</p></div><div class="col col-sm-10"> <input type="number" value="1.0" step="0.1" class="form-control" id="version-field"> </div></div><div class="row no-gutters"> <div class="col col-sm-2"> <p>Autor :</p></div><div class="col col-sm-10"> <input type="text" class="form-control" placeholder="Drigtime" id="author-field"> </div></div><br></div><div role="tabpanel" class="tab-pane" id="fightTab"> <br/> <div class="row"> <div class="col col-sm-5"> <p>Minimum number of monster : </p></div><div class="col col-sm-7"> <input type="number" max="8" min="1" value="1" id="min-monster" class="=" form-control> </div></div><div class="row"> <div class="col col-sm-5"> <p>Maximum number of monster : </p></div><div class="col col-sm-7"> <input type="number" max="8" min="1" value="8" id="max-monster" class="=" form-control> </div></div><br/> <div class="row panel panel-default" style="margin-left: 0; margin-right: 0"> <div class="panel-heading">Forbidden monster</div><div class="panel-body"> <div class="col col-sm-5"> <p>List of forbidden monster : </p></div><div class="col col\-sm\-6"><input type="text" class="form\-control" placeholder="ex : 101, 98 \.\.\." id="forbidden-ennemy-field"></div><div class="col col-sm-1"><a target="_blank" href="https://snowbot.eu/monstres.txt" class="fas fa-info-circle" style="font-size: 32px; text-decoration: none"></a></div></div></div><div class="row panel panel-default" style="margin-left: 0; margin-right: 0"> <div class="panel-heading">Mendatory monster</div><div class="panel-body"> <div class="col col-sm-5"> <p>List of mendatory monster : </p></div><div class="col col\-sm\-6"><input type="text" class="form\-control" placeholder="ex : 101, 98 \.\.\." id="mendatory-ennemy-field"></div><div class="col col-sm-1"><a target="_blank" href="https://snowbot.eu/monstres.txt" class="fas fa-info-circle" style="font-size: 32px; text-decoration: none"></a></div></div></div></div><div role="tabpanel" class="tab-pane" id="gatherTab"> <br/> <div class="checkbox checbox-switch switch-primary"> <label> <input type="checkbox" id="open-bag-checkbox" checked=""/> <span></span> Automatically open resource bags </label> </div><div class="panel panel-default" style="margin-left: 0; margin-right: 0"> <div class="panel-heading">Resources to gather</div><div class="panel-body" id="ressources-to-gather"> <div class="row"> <div class="col col-sm-5"> <p>List of resources to gather : </p></div><div class="col col-sm-7"> <select class="form-control selectpicker" data-live-search="true" multiple data-dropup-auto="false" id="ressources-selecter"> </select> </div></div><div class="ressources-selected-summary"></div></div></div></div><div role="tabpanel" class="tab-pane" id="bankTab"> <br/><div class="row panel panel-default" style="margin-left: 0; margin-right: 0"> <div class="panel-heading">Items to delete automatically</div><div class="panel-body"> <div class="col col-sm-5"> <p>List of items to delete automatically : </p></div><div class="col col\-sm\-6"><input type="text" class="form\-control" placeholder="ex : 101, 98 \.\.\." id="auto-delete-field"></div><div class="col col-sm-1"><a target="_blank" href="https://snowbot.eu/objets.txt" class="fas fa-info-circle" style="font-size: 32px; text-decoration: none"></a></div></div></div></div></div></div><div class="modal-footer"> <button type="button" class="btn btn-primary" data-dismiss="modal">Validate</button> </div></div></div></div></div>');
        //     $('#setting').empty().append('<div class="modal-dialog" role="document"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">×</span> </button> <h4 class="modal-title" id="myModalLabel">Setting</h4> </div><div class="modal-body"> <div role="tabpanel"> <ul class="nav nav-tabs" role="tablist"> <li role="presentation"> <a href="#shortcutTab" aria-controls="shortcutTab" role="tab" data-toggle="tab">Shortcuts</a> </li><li role="presentation" class="active"> <a href="#languageTab" aria-controls="languageTab" role="tab" data-toggle="tab">Language</a> </li></ul> <div class="tab-content"> <div role="tabpanel" class="tab-pane" id="shortcutTab"> <br/> <table class="table table-bordered table-hover table-condensed table-responsive"> <thead> <tr> <th> Action name </th> <th> Shortcuts </th> </tr></thead> <tbody> <tr> <td> Top </td><td> <input type="text" class="form\-control" id="shortcut-key-up" value="' + GM_getValue("shortcut-key-up", "z") + '" readonly> </td></tr><tr> <td> Bottom </td><td> <input type="text" class="form\-control" id="shortcut-key-down" value="' + GM_getValue("shortcut-key-down", "s") + '" readonly> </td></tr><tr> <td> Left </td><td> <input type="text" class="form\-control" id="shortcut-key-left" value="' + GM_getValue("shortcut-key-left", "q") + '" readonly> </td></tr><tr> <td> Right </td><td> <input type="text" class="form\-control" id ="shortcut-key-right" value="' + GM_getValue("shortcut-key-right", "d") + '" readonly> </td></tr><tr> <td> Havenbag </td><td> <input type="text" class="form\-control" id="shortcut-key-havenbag" value="' + GM_getValue("shortcut-key-havenbag", "a") + '" readonly> </td></tr><tr> <td> Erase an action </td><td> <input type="text" class="form\-control" id="shortcut-key-erase" value="' + GM_getValue("shortcut-key-erase", "e") + '" readonly> </td></tr></tbody> </table> </div><div role="tabpanel" class="tab-pane active" id="languageTab"> <br/> <div class="row panel panel-default" style="margin-left: 0; margin-right: 0"> <div class="panel-heading">Language</div><div class="panel-body"> <select multiple class="form-control" id="language-selected"> <option value="fr">Français</option> <option value="en">English</option> <option value="es">Español</option> </select> </div></div></div><div class="modal-footer"> <button type="button" class="btn btn-primary" data-dismiss="modal">Valider</button> </div></div></div></div></div></div>');
        //     $('#ressources-selecter').empty();
        //     for (let key in ressourcesEn) {
        //         $('#ressources-selecter').append('<option value="' + ressourcesEn[key].itemId + '">' + ressourcesEn[key].itemName + '</option>');
        //     }
        //     GM_setValue("language", "en");
        //     break;
        // case "es":
        //     $('#path-creator-bar').empty().append('<div class="leaflet-bar leaflet-control path-selecter"> <a class="leaflet-control-zoom-in fas fa-arrow-up" href="#" title="Arriba" style="color:black;"></a> <a class="leaflet-control-zoom-in fas fa-arrow-down" href="#" title="Abajo" style="color:black;"></a> <a class="leaflet-control-zoom-in fas fa-arrow-left" href="#" title="Izquierda" style="color:black;"></a> <a class="leaflet-control-zoom-in fas fa-arrow-right" href="#" title="Derecha" style="color:black;"></a> <a class="leaflet-control-zoom-in fas fa-suitcase" href="#" title="Merkasakos" style="color:black;"></a> </div><div class="leaflet-bar leaflet-control tool-selecter"> <a class="leaflet-control-zoom-in fas fa-eraser" href="#" title="Borrar una acción" style="color:black;"></a> <a class="leaflet-control-zoom-in fas fa-random" href="#" title="Lineal" style="color:black;"></a> </div><div class="leaflet-bar leaflet-control path-type-selecter"> <a class="leaflet-control-zoom-in fas fa-arrows-alt toggled" href="#" title="Desplazamiento" style="color:black;"></a> <a class="leaflet-control-zoom-in fas fa-shield-alt" href="#" title="Lucha" style="color:#d82121;"></a> <a class="leaflet-control-zoom-in fas fa-leaf" href="#" title="Cosechar" style="color:#229e22;"></a> <a class="leaflet-control-zoom-in fas fa-university" href="#" title="Banco" style="color:#3a3ab9;"></a> <a class="leaflet-control-zoom-in fas fa-fire" href="#" title="Fénix" style="color:purple;"></a> </div><div class="leaflet-bar leaflet-control path-setting"> <a class="leaflet-control-zoom-in fas fa-info-circle" href="#" title="Parámetro del trayecto" style="color:#3a3ab9;"></a> <a class="leaflet-control-zoom-in fas fa-save" href="#" title="salvaguardar" style="color:#3a3ab9;"></a> <input type="file" id="file" title="Ouvrir" style="display: none;"> <a class="leaflet-control-zoom-in fas fa-folder-open" href="#" title="Abrir" style="color:#ffd228;"></a> <a class="leaflet-control-zoom-in fas fa-trash-alt" href="#" title="Suprimir todo" style="color:#4c4c4c;"></a> <a class="leaflet-control-zoom-in fas fa-cog" href="#" title="Parámetro" style="color:#4c4c4c;"></a> </div>');
        //     $('#havenBagSetting').empty().append('<div class="modal-dialog" role="document"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button> <h4 class="modal-title" id="myModalLabel">Zaap : </h4> </div><div class="modal-body"> <label>Zaap d\'arrivée :</label> <select class="form-control" id="sel1"> <option value=\'{"map": "4,-19", "mapid": "84674563"}\'>Astrub | 4,-19</option> <option value=\'{"map": "-32,-56", "mapid": "147768"}\'>Bonta | -32,-56</option> <option value=\'{"map": "-26,35", "mapid": "144419"}\'>Brâkmar | -26,35</option> <option value=\'{"map": "-1,13", "mapid": "88212746"}\'>Amakna (Bord de la forêt maléfique) | -1,13</option> <option value=\'{"map": "3,-5", "mapid": "68552706"}\'>Amakna (Château d\'Amakna) | 3,-5</option> <option value=\'{"map": "5,7", "mapid": "88082704"}\'>Amakna (Coins des Bouftous) | 5,7</option> <option value=\'{"map": "7,-4", "mapid": "68419587"}\'>Amakna (Port de Madrestam) | 7,-4</option> <option value=\'{"map": "-2,0", "mapid": "88213271"}\'>Amakna (Village d\'Amakna) | -2,0</option> <option value=\'{"map": "-1,24", "mapid": "88212481"}\'>Amakna (Plaîne des Scarafeuilles) | -1,24</option> <option value=\'{"map": "10,22", "mapid": "88085249"}\'>Baie de Sufokia (Rivage Sufokien) | 10,22</option> <option value=\'{"map": "13,26", "mapid": "95422468"}\'>Baie de Sufokia (Sufokia) | 13,26</option> <option value=\'{"map": "-46,18", "mapid": "154642"}\'>Île d\'Otomaïl (Village côtier) | -46,18</option> <option value=\'{"map": "-79,-41", "mapid": "54172969"}\'>Île de Frigost (La Bourgade) | -79,-41</option> <option value=\'{"map": "-77,-73", "mapid": "54172489"}\'>Île de Frigost (Village enseveli) | -77,-73</option> <option value=\'{"map": "35,12", "mapid": "156762120"}\'>Île de Moon (Plage de la Tortue) | 35,12</option> <option value=\'{"map": "-16,1", "mapid": "73400320"}\'>Montagne des Koalaks (Village des Eleveurs) | -16,1</option> <option value=\'{"map": "26,-37", "mapid": "13605"}\'>Pandala Neutre (Faubourgs de Pandala) | 26,-37</option> <option value=\'{"map": "29,-49", "mapid": "15153"}\'>Pandala Feu (Village de Feudala) | 29,-49</option> <option value=\'{"map": "-27,-36", "mapid": "142087694"}\'>Plaine de Cania (Champs de Cania) | -27,-36</option> <option value=\'{"map": "-3,-42", "mapid": "156240386"}\'>Plaine de Cania (Lac de Cania) | -3,-42</option> <option value=\'{"map": "-13,-28", "mapid": "165152263"}\'>Plaine de Cania (Massif de Cania) | -13,-28</option> <option value=\'{"map": "-5,-23", "mapid": "84806401"}\'>Plaine de Cania (Plaine des Porkass) | -5,-23</option> <option value=\'{"map": "-17,-47", "mapid": "147590153"}\'>Plaine de Cania (Plaines Rocheuses) | -17,-47</option> <option value=\'{"map": "-20,-20", "mapid": "164364304"}\'>Plaine de Cania (Route Rocailleuse) | -20,-20</option> <option value=\'{"map": "15,-58", "mapid": "173278210"}\'>Saharach (Dunes des ossements) | 15,-58</option> <option value=\'{"map": "-25,12", "mapid": "171967506"}\'>Landes de Sidimote (Route des Roulottes) | -25,12</option> </select> </div><div class="modal-footer"> <button type="button" class="btn btn-secondary" data-dismiss="modal">Fermer</button> <button type="button" class="btn btn-primary">Valider</button> </div></div></div>');
        //     $('#pathSetting').empty().append(' <div class="modal-dialog" role="document"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">×</span> </button> <h4 class="modal-title" id="myModalLabel">Parámetro del trayecto</h4> </div><div class="modal-body"> <div role="tabpanel"> <ul class="nav nav-tabs" role="tablist"> <li role="presentation" class="active"> <a href="#informationTab" aria-controls="informationTab" role="tab" data-toggle="tab">Información</a> </li><li role="presentation"> <a href="#fightTab" aria-controls="fightTab" role="tab" data-toggle="tab">Lucha</a> </li><li role="presentation"> <a href="#gatherTab" aria-controls="gatherTab" role="tab" data-toggle="tab">Cosechar</a> </li><li role="presentation"> <a href="#bankTab" aria-controls="bankTab" role="tab" data-toggle="tab">Banco</a> </li></ul> <div class="tab-content"> <div role="tabpanel" class="tab-pane active" id="informationTab"> <br/> <div class="row no-gutters"> <div class="col col-sm-2"> <p>Nombre :</p></div><div class="col col-sm-10"> <input type="text" class="form-control" id="file-name-field"> </div><p></p></div><div class="row no-gutters"> <div class="col col-sm-2"> <p>Zona :</p></div><div class="col col-sm-10"> <input type="text" class="form-control" placeholder="Astrub" id="area-field"> </div></div><div class="row no-gutters"> <div class="col col-sm-2"> <p>Tipo :</p></div><div class="col col-sm-10"> <select class="form-control" id="type-field"> <option disabled selected value></option> <option>Lucha</option> <option>Desplazamiento</option> <option>Cosechar</option> </select> </div><p></p></div><div class="row no-gutters"> <div class="col col-sm-2"> <p>Versión :</p></div><div class="col col-sm-10"> <input type="number" value="1.0" step="0.1" class="form-control" id="version-field"> </div></div><div class="row no-gutters"> <div class="col col-sm-2"> <p>Autora :</p></div><div class="col col-sm-10"> <input type="text" class="form-control" placeholder="Drigtime" id="author-field"> </div></div><br></div><div role="tabpanel" class="tab-pane" id="fightTab"> <br/> <div class="row"> <div class="col col-sm-5"> <p>Número mínimo de monstruos : </p></div><div class="col col-sm-7"> <input type="number" max="8" min="1" value="1" id="min-monster" class="=" form-control> </div></div><div class="row"> <div class="col col-sm-5"> <p>Número máximo de monstruos : </p></div><div class="col col-sm-7"> <input type="number" max="8" min="1" value="8" id="max-monster" class="=" form-control> </div></div><br/> <div class="row panel panel-default" style="margin-left: 0; margin-right: 0"> <div class="panel-heading">Monstruos entredicho</div><div class="panel-body"> <div class="col col-sm-5"> <p>Lista monstruos que hay que evitar : </p></div><div class="col col\-sm\-6"><input type="text" class="form\-control" placeholder="ex : 101, 98 \.\.\." id="forbidden-ennemy-field"></div><div class="col col-sm-1"><a target="_blank" href="https://snowbot.eu/monstres.txt" class="fas fa-info-circle" style="font-size: 32px; text-decoration: none"></a></div></div></div><div class="row panel panel-default" style="margin-left: 0; margin-right: 0"> <div class="panel-heading">Monstruos obligatorio</div><div class="panel-body"> <div class="col col-sm-5"> <p>Lista monstruos que hay que tener : </p></div><div class="col col\-sm\-6"><input type="text" class="form\-control" placeholder="ex : 101, 98 \.\.\." id="mendatory-ennemy-field"></div><div class="col col-sm-1"><a target="_blank" href="https://snowbot.eu/monstres.txt" class="fas fa-info-circle" style="font-size: 32px; text-decoration: none"></a></div></div></div></div><div role="tabpanel" class="tab-pane" id="gatherTab"> <br/> <div class="checkbox checbox-switch switch-primary"> <label> <input type="checkbox" id="open-bag-checkbox" checked=""/> <span></span> Apertura automática de las bolsas de recursos </label> </div><div class="panel panel-default" style="margin-left: 0; margin-right: 0"> <div class="panel-heading">Recursos para cosechar</div><div class="panel-body" id="ressources-to-gather"> <div class="row"> <div class="col col-sm-5"> <p>Lista recursos para cosechar : </p></div><div class="col col-sm-7"> <select class="form-control selectpicker" data-live-search="true" multiple data-dropup-auto="false" id="ressources-selecter"> </select> </div></div><div class="ressources-selected-summary"></div></div></div></div><div role="tabpanel" class="tab-pane" id="bankTab"> <br/><div class="row panel panel-default" style="margin-left: 0; margin-right: 0"> <div class="panel-heading">Objetos que hay que suprimir automáticamente</div><div class="panel-body"> <div class="col col-sm-5"> <p>Lista objetos que hay que suprimir automáticamente : </p></div><div class="col col\-sm\-6"><input type="text" class="form\-control" placeholder="ex : 101, 98 \.\.\." id="auto-delete-field"></div><div class="col col-sm-1"><a target="_blank" href="https://snowbot.eu/objets.txt" class="fas fa-info-circle" style="font-size: 32px; text-decoration: none"></a></div></div></div></div></div></div><div class="modal-footer"> <button type="button" class="btn btn-primary" data-dismiss="modal">Validar</button> </div></div></div></div></div>');
        //     $('#setting').empty().append('<div class="modal-dialog" role="document"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">×</span> </button> <h4 class="modal-title" id="myModalLabel">Parámetro</h4> </div><div class="modal-body"> <div role="tabpanel"> <ul class="nav nav-tabs" role="tablist"> <li role="presentation"> <a href="#shortcutTab" aria-controls="shortcutTab" role="tab" data-toggle="tab">Atajos</a> </li><li role="presentation" class="active"> <a href="#languageTab" aria-controls="languageTab" role="tab" data-toggle="tab">Lengua</a> </li></ul> <div class="tab-content"> <div role="tabpanel" class="tab-pane" id="shortcutTab"> <br/> <table class="table table-bordered table-hover table-condensed table-responsive"> <thead> <tr> <th> Nombre de la acción </th> <th> Atajo </th> </tr></thead> <tbody> <tr> <td> Arriba </td><td> <input type="text" class="form\-control" id="shortcut-key-up" value=" ' + GM_getValue("shortcut-key-up", "z") + ' " readonly> </td></tr><tr> <td> Abajo </td><td> <input type="text" class="form\-control" id="shortcut-key-down" value=" ' + GM_getValue("shortcut-key-down", "s") + ' " readonly> </td></tr><tr> <td> Izquierda </td><td> <input type="text" class="form\-control" id="shortcut-key-left" value=" ' + GM_getValue("shortcut-key-left", "q") + ' " readonly> </td></tr><tr> <td> Derecha </td><td> <input type="text" class="form\-control" id ="shortcut-key-right" value=" ' + GM_getValue("shortcut-key-right", "d") + ' " readonly> </td></tr><tr> <td> Merkasakos </td><td> <input type="text" class="form\-control" id="shortcut-key-havenbag" value=" ' + GM_getValue("shortcut-key-havenbag", "a") + ' " readonly> </td></tr><tr> <td> Borrar una acción </td><td> <input type="text" class="form\-control" id="shortcut-key-erase" value=" ' + GM_getValue("shortcut-key-erase", "e") + ' " readonly> </td></tr></tbody> </table> </div><div role="tabpanel" class="tab-pane active" id="languageTab"> <br/> <div class="row panel panel-default" style="margin-left: 0; margin-right: 0"> <div class="panel-heading">Lengua</div><div class="panel-body"> <select multiple class="form-control" id="language-selected"> <option value="fr">Français</option> <option value="en">English</option> <option value="es">Español</option> </select> </div></div></div><div class="modal-footer"> <button type="button" class="btn btn-primary" data-dismiss="modal">Validar</button> </div></div></div></div></div></div>');
        //     $('#ressources-selecter').empty();
        //     for (let key in ressourcesEs) {
        //         $('#ressources-selecter').append('<option value="' + ressourcesEs[key].itemId + '">' + ressourcesEs[key].itemName + '</option>');
        //     }
        //     GM_setValue("language", "es");
        //     break;
        default:
            break;
    }
    $('#language-selected').change(function () {
        languageSelector($('#language-selected').val()[0]);
    });
    // $('#shortcut-key-up, #shortcut-key-down, #shortcut-key-left, #shortcut-key-right, #shortcut-key-havenbag, #shortcut-key-erase').focusin(function(){
    //     $(this).val("");
    //     switch (GM_getValue("language")) {
    //         case "fr":
    //             $(this).attr("placeholder", "Appuyer sur une touche");
    //             break;
    //         case "en":
    //             $(this).attr("placeholder", "Press a key");
    //             break;
    //         case "es":
    //             $(this).attr("placeholder", "Presione una tecla");
    //             break;
    //         default:
    //             break;
    //     }
    //     $(this).keydown(function (evt) {
    //         GM_setValue(this.id, evt.key);
    //         $(this).val(GM_getValue(this.id));
    //     });
    // });
    // $('#shortcut-key-up, #shortcut-key-down, #shortcut-key-left, #shortcut-key-right, #shortcut-key-havenbag, #shortcut-key-erase').focusout(function(){
    //     $(this).val(GM_getValue(this.id));
    // });
}
languageSelector("fr");

$('#file').change(function () {
    var file = this.files[0];
    var content;
    var reader = new FileReader();
    reader.onload = function (progressEvent) {
        // Entire file
        content = this.result;
        let regexPath = /function move\(\)[\s\S]+?return.*?{\r\n([\s\S]+?)}\r\n.*end/g;
        let regexPathLinear = /mapsWithChangeMap.?=.?{\r\n([\s\S]+?)}\r\n/g;
        let regexBank = /function bank\(\)[\s\S]+?return.*?{\r\n([\s\S]+?)}\r\n.*end/g;
        let regexPhenix = /function phenix\(\)[\s\S]+?return.*?{\r\n([\s\S]+?)}\r\n.*end/g;
        let result;
        let matche = regexBank.exec(content);
        loadingFile = true;
        $(".path-selecter .toggled").removeClass('toggled');
        if (matche !== null) {
            result = matche[1];
            result = result.split('\r\n');
            for (let index = 0; index < result.length; index++) {
                matche = /map.?=.?"(.*?)"/g.exec(result[index]);
                if (matche !== null) actualMap = matche[1];
                actualMap = actualMap.replace(/,/g, ", ");
                if (/(-|)[0-9]+?,\s(-|)[0-9]+?/g.exec(actualMap)) {
                    matche = /top/g.exec(result[index]);
                    if (matche !== null) $(".fa-arrow-up").addClass('toggled');
                    matche = /left/g.exec(result[index]);
                    if (matche !== null) $(".fa-arrow-left").addClass('toggled');
                    matche = /bottom/g.exec(result[index]);
                    if (matche !== null) $(".fa-arrow-down").addClass('toggled');
                    matche = /right/g.exec(result[index]);
                    if (matche !== null) $(".fa-arrow-right").addClass('toggled');
                    $(".path-type-selecter .toggled").removeClass('toggled');
                    $(".fa-university").addClass('toggled');
                    onMapClick();
                    $(".path-selecter .toggled").removeClass('toggled');
                    $(".path-type-selecter .toggled").removeClass('toggled');
                }
            }
        }

        matche = regexPathLinear.exec(content);
        if (matche !== null) {
            result = matche[1];
            result = result.split('\r\n');
            $(".fa-random").addClass('toggled');
            for (let index = 0; index < result.length; index++) {
                matche = /map.?=.?"(.*?)"/g.exec(result[index]);
                if (matche !== null) actualMap = matche[1];
                actualMap = actualMap.replace(/,/g, ", ");
                if (/(-|)[0-9]+?,\s(-|)[0-9]+?/g.exec(actualMap)) {
                    let loadAddLinearAction = function (param) {
                        matche = param.exec(result[index]);
                        if (matche !== null) {
                            if (matche[1] == "top") $(".fa-arrow-up").addClass('toggled');
                            if (matche[1] == "left") $(".fa-arrow-left").addClass('toggled');
                            if (matche[1] == "bottom") $(".fa-arrow-down").addClass('toggled');
                            if (matche[1] == "right") $(".fa-arrow-right").addClass('toggled');
                        }
                        $(".fa-arrows-alt").addClass('toggled');
                        matche = /gather/g.exec(result[index]);
                        if (matche !== null) $(".fa-leaf").addClass('toggled');
                        matche = /fight/g.exec(result[index]);
                        if (matche !== null) $(".fa-shield-alt").addClass('toggled');
                        onMapClick();
                        $(".path-selecter .toggled").removeClass('toggled');
                        $(".path-type-selecter .toggled").removeClass('toggled');
                    };
                    loadAddLinearAction(/changeMap.?=.?"(.+?)"/g);
                    loadAddLinearAction(/nextMap.?=.?"(.+?)"/g);
                    loadAddLinearAction(/thirdMap.?=.?"(.+?)"/g);
                    loadAddLinearAction(/fourthMap.?=.?"(.+?)"/g);
                }
            }
            $(".fa-random.toggled").removeClass('toggled');
        } else if ((matche = regexPath.exec(content)) !== null) {
            result = matche[1];
            result = result.split('\r\n');
            for (let index = 0; index < result.length; index++) {
                matche = /map.?=.?"(.*?)"/g.exec(result[index]);
                if (matche !== null) actualMap = matche[1];
                actualMap = actualMap.replace(/,/g, ", ");
                if (/(-|)[0-9]+?,\s(-|)[0-9]+?/g.exec(actualMap)) {
                    matche = /top/g.exec(result[index]);
                    if (matche !== null) $(".fa-arrow-up").addClass('toggled');
                    matche = /left/g.exec(result[index]);
                    if (matche !== null) $(".fa-arrow-left").addClass('toggled');
                    matche = /bottom/g.exec(result[index]);
                    if (matche !== null) $(".fa-arrow-down").addClass('toggled');
                    matche = /right/g.exec(result[index]);
                    if (matche !== null) $(".fa-arrow-right").addClass('toggled');
                    $(".fa-arrows-alt").addClass('toggled');
                    matche = /gather/g.exec(result[index]);
                    if (matche !== null) $(".fa-leaf").addClass('toggled');
                    matche = /fight/g.exec(result[index]);
                    if (matche !== null) $(".fa-shield-alt").addClass('toggled');
                    onMapClick();
                    $(".path-selecter .toggled").removeClass('toggled');
                    $(".path-type-selecter .toggled").removeClass('toggled');
                }
            }
        }
        matche = regexPhenix.exec(content);
        if (matche !== null) {
            result = matche[1];
            result = result.split('\r\n');
            for (let index = 0; index < result.length; index++) {
                matche = /map.?=.?"(.*?)"/g.exec(result[index]);
                if (matche !== null) actualMap = matche[1];
                actualMap = actualMap.replace(/,/g, ", ");
                if (/(-|)[0-9]+?,\s(-|)[0-9]+?/g.exec(actualMap)) {
                    matche = /top/g.exec(result[index]);
                    if (matche !== null) $(".fa-arrow-up").addClass('toggled');
                    matche = /left/g.exec(result[index]);
                    if (matche !== null) $(".fa-arrow-left").addClass('toggled');
                    matche = /bottom/g.exec(result[index]);
                    if (matche !== null) $(".fa-arrow-down").addClass('toggled');
                    matche = /right/g.exec(result[index]);
                    if (matche !== null) $(".fa-arrow-right").addClass('toggled');
                    $(".fa-fire").addClass('toggled');
                    onMapClick();
                    $(".path-selecter .toggled").removeClass('toggled');
                    $(".path-type-selecter .toggled").removeClass('toggled');
                }
            }
        }
        $(".fa-arrows-alt").addClass('toggled');
        loadingFile = false;
    };
    reader.readAsText(file);
});

// $(document).keydown(function (evt) {
//     var keyCode = evt.key;
//     switch (keyCode) {
//         case GM_getValue("shortcut-key-up", "z"):
//             if ($(".fa-arrow-up.toggled").length > 0)
//                 $(".fa-arrow-up.toggled").removeClass('toggled');
//             else {
//                 $(".fa-arrow-up").toggleClass('toggled');
//                 $(".fa-suitcase.toggled").removeClass('toggled');
//             }
//             break;
//         case GM_getValue("shortcut-key-left", "q"):
//             if ($(".fa-arrow-left.toggled").length > 0)
//                 $(".fa-arrow-left.toggled").removeClass('toggled');
//             else {
//                 $(".fa-arrow-left").toggleClass('toggled');
//                 $(".fa-suitcase.toggled").removeClass('toggled');
//             }
//             break;
//         case GM_getValue("shortcut-key-down", "s"):
//             if ($(".fa-arrow-down.toggled").length > 0)
//                 $(".fa-arrow-down.toggled").removeClass('toggled');
//             else {
//                 $(".fa-arrow-down").toggleClass('toggled');
//                 $(".fa-suitcase.toggled").removeClass('toggled');
//             }
//             break;
//         case GM_getValue("shortcut-key-right", "d"):
//             if ($(".fa-arrow-right.toggled").length > 0)
//                 $(".fa-arrow-right.toggled").removeClass('toggled');
//             else {
//                 $(".fa-arrow-right").toggleClass('toggled');
//                 $(".fa-suitcase.toggled").removeClass('toggled');
//             }
//             break;
//         case GM_getValue("shortcut-key-havenbag", "a"):
//             if ($(".fa-suitcase.toggled").length > 0)
//                 $(".fa-suitcase.toggled").removeClass('toggled');
//             else {
//                 $(".fa-arrow-up.toggled").removeClass('toggled');
//                 $(".fa-arrow-left.toggled").removeClass('toggled');
//                 $(".fa-arrow-down.toggled").removeClass('toggled');
//                 $(".fa-arrow-right.toggled").removeClass('toggled');
//                 $(".fa-suitcase").toggleClass('toggled');
//             }
//             break;
//         case GM_getValue("shortcut-key-erase", "e"):
//             if ($(".fa-eraser.toggled").length > 0)
//                 $(".fa-eraser.toggled").removeClass('toggled');
//             else {
//                 $(".fa-eraser").toggleClass('toggled');
//             }
//             break;
//         default:
//             break;
//     }
// });

$('#havenBagSetting').on('click', '.btn-primary', function () {
    let e = $('#sel1 option:selected');
    var objMap = JSON.parse(e.val());
    if ($(".fa-arrows-alt.toggled").length > 0 || $(".fa-leaf.toggled").length > 0 || $(".fa-shield-alt.toggled").length > 0)
        havenBagData.push({
            map: actualMap[0] + "," + actualMap[1],
            mapToGo: objMap.map,
            mapidToGo: objMap.mapid,
            move: true,
        });
    else if ($(".fa-university.toggled").length > 0)
        havenBagData.push({
            map: actualMap[0] + "," + actualMap[1],
            mapToGo: objMap.map,
            mapidToGo: objMap.mapid,
            bank: true,
        });
    else if ($(".fa-fire.toggled").length > 0)
        havenBagData.push({
            map: actualMap[0] + "," + actualMap[1],
            mapToGo: objMap.map,
            mapidToGo: objMap.mapid,
            phenix: true
        });
    $('#havenBagSetting').modal('hide');
    onMapClick();
});

$('#havenBagSetting').on('click', '.btn-secondary', function () {
    havenToggle = false;
    $('#havenBagSetting').modal('hide');
});

$('#havenBagSetting').on('click', '.close', function () {
    havenToggle = false;
    $('#havenBagSetting').modal('hide');
});

function linearActualItem(index, time) {
    if (GM_getValue('language') == 'fr') {
        if (pathLinearData[index].top.index == time) return 'Haut';
        else if (pathLinearData[index].left.index == time) return 'Gauche';
        else if (pathLinearData[index].bottom.index == time) return 'Bas';
        else if (pathLinearData[index].right.index == time) return 'Droite';
        else if (pathLinearData[index].havenbag.index == time) return 'Havre-sac';
    } else if (GM_getValue('language') == 'en') {
        if (pathLinearData[index].top.index == time) return 'Top';
        else if (pathLinearData[index].left.index == time) return 'Left';
        else if (pathLinearData[index].bottom.index == time) return 'Bottom';
        else if (pathLinearData[index].right.index == time) return 'Right';
        else if (pathLinearData[index].havenbag.index == time) return 'Havenbag';
    } else if (GM_getValue('language') == 'es') {
        if (pathLinearData[index].top.index == time) return 'Arriba';
        else if (pathLinearData[index].left.index == time) return 'Bajo';
        else if (pathLinearData[index].bottom.index == time) return 'Izquierda';
        else if (pathLinearData[index].right.index == time) return 'Derecha';
        else if (pathLinearData[index].havenbag.index == time) return 'Merkasako';
    }
}

function LMap() {
    if (map) {
        map.on('click', onMapClick);
        map.on('mousemove', function () {
            for (let index = 0; index < pathLinearData.length; index++) {
                if (pathLinearData[index].map == $('#mapCoordinates').text()) {
                    if (pathLinearData[index].index == 4) {
                        if ('fr') {
                            $('#mapCoordinates').append(
                                '<span><br />Premiére action sur la map : ' + linearActualItem(index, 1) +
                                '<br />Deuxiéme action sur la map : ' + linearActualItem(index, 2) +
                                '<br />Troisiéme action sur la map : ' + linearActualItem(index, 3) +
                                '<br />Quatrième action sur la map : ' + linearActualItem(index, 4) + '</span>'
                            );
                        }
                        // } else if (GM_getValue('language') == 'en') {
                        //     $('#mapCoordinates').append(
                        //         '<span><br />First action on the map : ' + linearActualItem(index, 1) +
                        //         '<br />Second action on the map : ' + linearActualItem(index, 2) +
                        //         '<br />Third action on the map : ' + linearActualItem(index, 3) +
                        //         '<br />Fourth action on the map : ' + linearActualItem(index, 4) + '</span>'
                        //     );
                        // } else if (GM_getValue('language') == 'es') {
                        //     $('#mapCoordinates').append(
                        //         '<span><br />Primera acción en el mapa: ' + linearActualItem(index, 1) +
                        //         '<br />Segunda acción en el mapa : ' + linearActualItem(index, 2) +
                        //         '<br />Tercera acción en el mapa : ' + linearActualItem(index, 3) +
                        //         '<br />Cuarta acción en el mapa : ' + linearActualItem(index, 4) + '</span>'
                        //     );
                        // }
                    } else if (pathLinearData[index].index == 3) {
                        if ('fr') {
                            $('#mapCoordinates').append(
                                '<span><br />Premiére action sur la map : ' + linearActualItem(index, 1) +
                                '<br />Deuxiéme action sur la map : ' + linearActualItem(index, 2) +
                                '<br />Troisiéme action sur la map : ' + linearActualItem(index, 3) + '</span>'
                            );
                        }
                        // } else if (GM_getValue('language') == 'en') {
                        //     $('#mapCoordinates').append(
                        //         '<span><br />First action on the map : ' + linearActualItem(index, 1) +
                        //         '<br />Second action on the map : ' + linearActualItem(index, 2) +
                        //         '<br />Third action on the map : ' + linearActualItem(index, 3) + '</span>'
                        //     );
                        // } else if (GM_getValue('language') == 'es') {
                        //     $('#mapCoordinates').append(
                        //         '<span><br />Primera acción en el mapa: ' + linearActualItem(index, 1) +
                        //         '<br />Segunda acción en el mapa : ' + linearActualItem(index, 2) +
                        //         '<br />Tercera acción en el mapa : ' + linearActualItem(index, 3) + '</span>'
                        //     );
                        // }
                    } else if (pathLinearData[index].index == 2) {
                        if ('fr') {
                            $('#mapCoordinates').append(
                                '<span><br />Premiére action sur la map : ' + linearActualItem(index, 1) +
                                '<br />Deuxiéme action sur la map : ' + linearActualItem(index, 2) + '</span>'
                            );
                        }

                        // } else if (GM_getValue('language') == 'en') {
                        //     $('#mapCoordinates').append(
                        //         '<span><br />First action on the map : ' + linearActualItem(index, 1) +
                        //         '<br />Second action on the map : ' + linearActualItem(index, 2) + '</span>'
                        //     );
                        // } else if (GM_getValue('language') == 'es') {
                        //     $('#mapCoordinates').append(
                        //         '<span><br />Primera acción en el mapa: ' + linearActualItem(index, 1) +
                        //         '<br />Segunda acción en el mapa : ' + linearActualItem(index, 2) + '</span>'
                        //     );
                        // }
                    } else if (pathLinearData[index].index == 1) {
                        if ('fr') {
                            $('#mapCoordinates').append(
                                '<span><br />Premiére action sur la map : ' + linearActualItem(index, 1) + '</span>'
                            );
                        }
                        // } else if (GM_getValue('language') == 'en') {
                        //     $('#mapCoordinates').append(
                        //         '<span><br />PFirst action on the map : ' + linearActualItem(index, 1) + '</span>'
                        //     );
                        // } else if (GM_getValue('language') == 'es') {
                        //     $('#mapCoordinates').append(
                        //         '<span><br />Primera acción en el mapa: ' + linearActualItem(index, 1) + '</span>'
                        //     );
                        // }
                    }
                }
            }
        });
    } else {
        setTimeout(function () {
            LMap();
        }, 50);
    }
}
LMap();

$('#path-creator-bar').on('click', '.fa-folder-open', function () {
    $('#file').trigger('click');
});

$('#path-creator-bar').on('click', '.fa-trash-alt', function () {
    let deleteAll = function (array) {
        for (let index = 0; index < array.length; index) {
            if (array[index].top)
                if (array[index].top.icon) map.removeLayer(array[index].top.icon);
            if (array[index].bottom)
                if (array[index].bottom.icon) map.removeLayer(array[index].bottom.icon);
            if (array[index].left)
                if (array[index].left.icon) map.removeLayer(array[index].left.icon);
            if (array[index].right)
                if (array[index].right.icon) map.removeLayer(array[index].right.icon);
            if (array[index].havenbag)
                if (array[index].havenbag.icon) map.removeLayer(array[index].havenbag.icon);
            array.splice(index, 1);
        }
    };
    deleteAll(pathData);
    deleteAll(pathLinearData);
    deleteAll(bankData);
    deleteAll(phenixData);
    deleteAll(havenBagData);
    console.clear();
});

$('#path-creator-bar').on('click', '.fa-eraser, .fa-random', function () {
    $(this).toggleClass('toggled');
    if (($('.fa-random.toggled').length > 0)) {
        $('.fa-arrows-alt').toggleClass('toggled');
        $('.fa-fire').removeClass("toggled");
        $('.fa-fire').css("background-color", "#999");
        $('.fa-fire').css("pointer-events", "none");
        $('.fa-university').removeClass("toggled");
        $('.fa-university').css("background-color", "#999");
        $('.fa-university').css("pointer-events", "none");

    } else {
        $('.fa-fire').css("background-color", "white");
        $('.fa-fire').css("pointer-events", "auto");
        $('.fa-university').css("background-color", "white");
        $('.fa-university').css("pointer-events", "auto");
    }

});

$('#path-creator-bar').on('click', '.fa-arrows-alt, .fa-shield-alt, .fa-leaf, .fa-university, .fa-fire', function () {
    $(".path-type-selecter .toggled").removeClass("toggled");
    $(this).toggleClass('toggled');
    if ($(".fa-fire.toggled").length > 0) {
        for (let key in phenixPos) {
            if (phenixPos[key].marker)
                map.removeLayer(phenixPos[key].marker);
            phenixPos[key].marker = undefined;
        }
        for (let key in phenixPos) {
            phenixPos[key].marker = L.marker(dofusXYToMapXY(phenixPos[key].map.split(",")[0] * 1 + 0.5, phenixPos[key].map.split(",")[1] * 1 + 0.5), {
                interactive: true,
                zIndexOffset: 5000,
                icon: icon.hint.phenix
            }).addTo(map);
        }
    } else {
        for (let key in phenixPos) {
            if (phenixPos[key].marker)
                map.removeLayer(phenixPos[key].marker);
            phenixPos[key].marker = undefined;
        }
    }
    if ($(".fa-university.toggled").length > 0) {
        for (let key in bankPos) {
            if (bankPos[key].marker)
                map.removeLayer(bankPos[key].marker);
            bankPos[key].marker = undefined;
        }
        for (let key in bankPos) {
            bankPos[key].marker = L.marker(dofusXYToMapXY(bankPos[key].map.split(",")[0] * 1 + 0.5, bankPos[key].map.split(",")[1] * 1 + 0.5), {
                interactive: true,
                zIndexOffset: 5000,
                icon: icon.hint.bank
            }).addTo(map);
        }
    } else {
        for (let key in bankPos) {
            if (bankPos[key].marker)
                map.removeLayer(bankPos[key].marker);
            bankPos[key].marker = undefined;
        }
    }
});

$('#path-creator-bar').on('click', '.fa-suitcase', function () {
    $(".fa-arrow-up.toggled").removeClass('toggled');
    $(".fa-arrow-left.toggled").removeClass('toggled');
    $(".fa-arrow-down.toggled").removeClass('toggled');
    $(".fa-arrow-right.toggled").removeClass('toggled');
    $(this).toggleClass('toggled');
});

$('#path-creator-bar').on('click', '.fa-arrow-up, .fa-arrow-down, .fa-arrow-left, .fa-arrow-right', function () {
    $(".fa-suitcase.toggled").removeClass("toggled");
    $(this).toggleClass('toggled');
});

$('#path-creator-bar').on('click', '.fa-cog', function () {
    $('#setting').modal('show');
});

$('#path-creator-bar').on('click', '.fa-info-circle', function () {
    $('#pathSetting').modal('show');
    $('#ressources-selecter').selectpicker('refresh');
});

$("#pathSetting").on('change', '#ressources-selecter', function () {
    // gatherData = $('#ressources-selecter').val();
    $('#ressources-to-gather .ressources-selected-summary').empty();
    $("#ressources-selecter option:selected").each(function () {
        $('#ressources-to-gather .ressources-selected-summary').append('<button class="btn btn-success" style="margin: 2.5px;">' + $(this).text() + '</button>');
    });
});