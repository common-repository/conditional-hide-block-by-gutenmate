/**
 * WordPress dependencies
 */

import { addFilter } from "@wordpress/hooks";
import { __ } from "@wordpress/i18n";
import { InspectorControls } from "@wordpress/block-editor";
import {
	ToggleControl,
	PanelBody,
	Button,
	__experimentalHStack as HStack,
	BaseControl,
} from "@wordpress/components";
import TokenList from "@wordpress/token-list";
import { ReactComponent as PhoneIcon } from "./assets/phone.svg";
import { ReactComponent as TabletIcon } from "./assets/tablet.svg";
import { ReactComponent as DesktopIcon } from "./assets/desktop.svg";

import "./style.scss";
import "./editor.scss";

/* Config */

const hideSMClass = "gtm-hide-sm";
const hideMDClass = "gtm-hide-md";
const hideLGClass = "gtm-hide-lg";
const hideWhenFirstChild = "gtm-hide-when-first-child";
const hideWhenLastChild = "gtm-hide-when-last-child";

function addAttributes(settings, name) {
	if (name == "core/query") {
		settings.attributes.gtmHideWhenNoResult = {
			type: "boolean",
			default: false,
		};
	}

	return settings;
}

const EditControls = (props) => {
	const { attributes, setAttributes } = props;
	const classList = new TokenList(attributes.className);
	const isHideSM = classList.contains(hideSMClass);
	const isHideMD = classList.contains(hideMDClass);
	const isHideLG = classList.contains(hideLGClass);
	const isHideWhenFirstChild = classList.contains(hideWhenFirstChild);
	const isHideWhenLastChild = classList.contains(hideWhenLastChild);

	return (
		<InspectorControls>
			<PanelBody title={__("Visibility", "gtm")} initialOpen={false}>
				<BaseControl
					__nextHasNoMarginBottom
					label={__("Hide on device", "gtm")}
					help={__("Hide the block on the selected device", "gtm")}
				>
					<HStack className="gtm-block-visibility-selector">
						<Button
							label={__("Small screen (SM)", "gtm")}
							variant="tertiary"
							isPressed={isHideSM}
							icon={PhoneIcon}
							onClick={() => {
								classList.toggle(hideSMClass, !isHideSM);
								setAttributes({
									className: classList.value,
								});
							}}
						></Button>
						<Button
							label={__("Medium screen (MD)", "gtm")}
							variant="tertiary"
							isPressed={isHideMD}
							onClick={() => {
								classList.toggle(hideMDClass, !isHideMD);
								setAttributes({
									className: classList.value,
								});
							}}
						>
							<TabletIcon />
						</Button>
						<Button
							label={__("Large screen (LG)", "gtm")}
							variant="tertiary"
							isPressed={isHideLG}
							onClick={() => {
								classList.toggle(hideLGClass, !isHideLG);
								setAttributes({
									className: classList.value,
								});
							}}
						>
							<DesktopIcon />
						</Button>
					</HStack>
				</BaseControl>

				<BaseControl
					__nextHasNoMarginBottom
					label={__("Hide conditions", "gtm")}
					help={__(
						"Hide the block on the selected conditions",
						"gtm"
					)}
				>
					<ToggleControl
						checked={isHideWhenFirstChild}
						label={__("Hide when first child", "gtm")}
						onChange={() => {
							classList.toggle(
								hideWhenFirstChild,
								!isHideWhenFirstChild
							);
							setAttributes({
								className: classList.value,
							});
						}}
					/>

					<ToggleControl
						checked={isHideWhenLastChild}
						label={__("Hide when last child", "gtm")}
						onChange={() => {
							classList.toggle(
								hideWhenLastChild,
								!isHideWhenLastChild
							);
							setAttributes({
								className: classList.value,
							});
						}}
					/>

					{props.name == "core/query" && (
						<ToggleControl
							label={__("Hide when no query results", "gtm")}
							checked={attributes.gtmHideWhenNoResult}
							onChange={(val) => {
								setAttributes({ gtmHideWhenNoResult: val });
							}}
						/>
					)}
				</BaseControl>
			</PanelBody>
		</InspectorControls>
	);
};

const withEditControls = (BlockEdit) => (props) => {
	const controls = [];

	if (props.isSelected) {
		controls.push(<EditControls key={controls.length + 1} {...props} />);
	}

	return (
		<>
			<BlockEdit {...props} />
			{props.isSelected && controls}
		</>
	);
};

/* Register Hooks */

addFilter("blocks.registerBlockType", `gtm/visibility`, addAttributes);
addFilter("editor.BlockEdit", `gtm/visibility`, withEditControls);
