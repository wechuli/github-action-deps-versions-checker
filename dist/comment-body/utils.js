"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.displayName = exports.displayVersion = exports.getDirectionIcon = exports.createDiffTableBody = exports.isDiffTypeFilter = void 0;
/**
 * Will return a function used to retrieve only T type objects
 */
function isDiffTypeFilter(updateType) {
    return function (item) {
        return item.update.type === updateType;
    };
}
exports.isDiffTypeFilter = isDiffTypeFilter;
function createDiffTableBody(packageDiffListList, header, columnList, separatorList, rowDataProvider, detailsPanel = true) {
    let body;
    if (detailsPanel) {
        body = '<details>\n'
            + ' <summary>' + header + '</summary>\n'
            + '\n';
    }
    else {
        body = '#### ' + header + '\n';
    }
    body += '| ' + columnList.join(' | ') + ' |\n'
        + '| ' + separatorList.join(' | ') + ' |\n'
        + packageDiffListList.map((packageDiffList) => packageDiffList.map((item) => '| ' + rowDataProvider(item).join(' | ') + ' |').join('\n'))
            .filter(item => item.length > 0) // Remove empty line (from empty list)
            .join('\n') + '\n'
        + '\n';
    if (detailsPanel) {
        body += '</details>\n'
            + '\n';
    }
    return body;
}
exports.createDiffTableBody = createDiffTableBody;
function getDirectionIcon(version) {
    if ('UPDATED' === version.update.type) {
        switch (version.update.direction) {
            case 'UP':
                return '↗️️';
            case 'DOWN':
                return '↘️‼️️';
            case 'NONE':
                return '✔️';
            case 'UNKNOWN':
                return '➡️';
        }
    }
    return '⁉️️️️';
}
exports.getDirectionIcon = getDirectionIcon;
function displayVersion(version) {
    return version.full
        + (version.isDev ? '❗' : '');
}
exports.displayVersion = displayVersion;
function displayName(versionDiff) {
    let modifier = '';
    if (versionDiff.isRootDevRequirement) {
        modifier = '_'; // Italic
    }
    else if (versionDiff.isRootRequirement) {
        modifier = '**'; // Bold
    }
    let requirementUpdateLabel = '';
    if (isDiffTypeFilter('UPDATED')(versionDiff)) {
        const currentRequirement = versionDiff.current.requirement;
        const previousRequirement = versionDiff.previous.requirement;
        if (currentRequirement !== previousRequirement) {
            requirementUpdateLabel = ` (${previousRequirement}->${currentRequirement})`;
        }
        else {
            requirementUpdateLabel = ` (${currentRequirement})`;
        }
    }
    else if ((isDiffTypeFilter('ADDED')(versionDiff) || isDiffTypeFilter('UNKNOWN')(versionDiff))
        && versionDiff.current !== undefined) {
        requirementUpdateLabel = ` (${versionDiff.current.requirement})`;
    }
    return modifier
        + (versionDiff.extra.sourceLink !== undefined ? '[' + versionDiff.name + '](' + versionDiff.extra.sourceLink + ')' : versionDiff.name)
        + requirementUpdateLabel
        + modifier;
}
exports.displayName = displayName;
